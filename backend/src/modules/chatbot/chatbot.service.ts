import { Type, FunctionDeclaration } from "@google/genai";
import { Brackets } from "typeorm";

import { AppDataSource } from "@/config/config-database";
import { geminiClient, geminiModel } from "@/config/gemini";
import { Destination, DestinationStatus } from "@/modules/destinations/entities/destination.entity";
import { Tour, TourStatus } from "@/modules/tours/entities/tour.entity";
import { TourSchedule, TourScheduleStatus } from "@/modules/tour-schedules/entities/tour-schedule.entity";


const SYSTEM_PROMPT = `Bạn là trợ lý du lịch AI của Travel Booking, một nền tảng đặt tour du lịch trực tuyến.
Nhiệm vụ: trả lời ngắn gọn, hữu ích, thân thiện bằng tiếng Việt.
Hỗ trợ: tìm kiếm tour, tư vấn điểm đến, xem lịch khởi hành, giá tour, thông tin đặt tour.
Không bịa thông tin giá, lịch trình, chỗ trống mà hệ thống chưa cung cấp.
Khi cần dữ liệu thật về tour, điểm đến, lịch khởi hành, hãy gọi function tương ứng trước khi trả lời.
Khi trả về danh sách tour, hãy format đẹp với tên, giá, thời gian, điểm đến.`;

const functionDeclarations: FunctionDeclaration[] = [
  {
    name: "search_tours",
    description: "Tìm kiếm tour du lịch theo từ khóa, điểm đến, hoặc khoảng giá",
    parameters: {
      type: Type.OBJECT,
      properties: {
        keyword: { type: Type.STRING, description: "Từ khóa tìm kiếm (tên tour, mô tả)" },
        destinationName: { type: Type.STRING, description: "Tên điểm đến" },
        maxPrice: { type: Type.NUMBER, description: "Giá tối đa (VND)" },
        limit: { type: Type.NUMBER, description: "Số kết quả tối đa (mặc định 5)" },
      },
    },
  },
  {
    name: "get_tour_details",
    description: "Lấy chi tiết một tour cụ thể theo ID hoặc slug",
    parameters: {
      type: Type.OBJECT,
      properties: {
        tourId: { type: Type.NUMBER, description: "ID của tour" },
        slug: { type: Type.STRING, description: "Slug của tour" },
      },
    },
  },
  {
    name: "get_destinations",
    description: "Lấy danh sách tất cả điểm đến du lịch",
    parameters: { type: Type.OBJECT, properties: {} },
  },
  {
    name: "get_tour_schedules",
    description: "Lấy lịch khởi hành còn chỗ của một tour",
    parameters: {
      type: Type.OBJECT,
      properties: {
        tourId: { type: Type.NUMBER, description: "ID của tour" },
      },
      required: ["tourId"],
    },
  },
];

async function executeFunctionCall(name: string, args: Record<string, any>) {
  switch (name) {
    case "search_tours": {
      const qb = AppDataSource.getRepository(Tour)
        .createQueryBuilder("tour")
        .leftJoinAndSelect("tour.destination", "destination")
        .leftJoinAndSelect("tour.category", "category")
        .leftJoinAndSelect("tour.images", "images")
        .where("tour.status = :status", { status: TourStatus.ACTIVE });

      if (args.keyword) {
        qb.andWhere(
          new Brackets((q) =>
            q
              .where("tour.title LIKE :kw", { kw: `%${args.keyword}%` })
              .orWhere("tour.description LIKE :kw", { kw: `%${args.keyword}%` })
          )
        );
      }
      if (args.destinationName) {
        qb.andWhere("destination.name LIKE :dest", { dest: `%${args.destinationName}%` });
      }
      if (args.maxPrice) {
        qb.andWhere("tour.priceAdult <= :maxPrice", { maxPrice: args.maxPrice });
      }

      const tours = await qb.take(args.limit || 5).getMany();
      return {
        tours: tours.map((t) => ({
          id: t.id,
          title: t.title,
          slug: t.slug,
          image: t.images?.find((i) => i.isThumbnail)?.url || t.images?.[0]?.url || null,
          priceAdult: t.priceAdult,
          priceChild: t.priceChild,
          durationDays: t.durationDays,
          durationNights: t.durationNights,
          destination: t.destination?.name,
          category: t.category?.name,
          shortDescription: t.shortDescription,
        })),
      };
    }

    case "get_tour_details": {
      const repo = AppDataSource.getRepository(Tour);
      const tour = args.slug
        ? await repo.findOne({ where: { slug: args.slug, status: TourStatus.ACTIVE }, relations: ["destination", "category", "images"] })
        : await repo.findOne({ where: { id: args.tourId, status: TourStatus.ACTIVE }, relations: ["destination", "category", "images"] });

      if (!tour) return { error: "Không tìm thấy tour" };
      return {
        tour: {
          id: tour.id,
          title: tour.title,
          slug: tour.slug,
          description: tour.description,
          priceAdult: tour.priceAdult,
          priceChild: tour.priceChild,
          durationDays: tour.durationDays,
          durationNights: tour.durationNights,
          departureLocation: tour.departureLocation,
          transport: tour.transport,
          maxPeople: tour.maxPeople,
          destination: tour.destination?.name,
          category: tour.category?.name,
          images: tour.images?.map((i) => i.url),
        },
      };
    }

    case "get_destinations": {
      const destinations = await AppDataSource.getRepository(Destination).find({
        where: { status: DestinationStatus.ACTIVE },
      });
      return { destinations: destinations.map((d) => ({ id: d.id, name: d.name, description: d.description })) };
    }

    case "get_tour_schedules": {
      const schedules = await AppDataSource.getRepository(TourSchedule).find({
        where: { tourId: args.tourId, status: TourScheduleStatus.OPEN },
        order: { startDate: "ASC" },
      });
      return {
        schedules: schedules.map((s) => ({
          id: s.id,
          startDate: s.startDate,
          endDate: s.endDate,
          priceAdult: s.priceAdult,
          priceChild: s.priceChild,
          availableSeats: s.availableSeats - s.bookedSeats,
        })),
      };
    }

    default:
      return { error: `Unknown function: ${name}` };
  }
}

const MAX_ROUNDS = 4;

export async function generateChatReply(message: string, history: any[]) {
  let contents = [...history, { role: "user", parts: [{ text: message }] }];
  let tours: any[] = [];

  for (let round = 0; round < MAX_ROUNDS; round++) {
    const response = await geminiClient.models.generateContent({
      model: geminiModel,
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        tools: [{ functionDeclarations }],
      },
    });

    const functionCalls = response.functionCalls ?? [];
    if (functionCalls.length === 0) {
      return { reply: response.text ?? "Xin lỗi, tôi không hiểu yêu cầu của bạn.", tours: tours.length ? tours : undefined };
    }

    const functionResponses = await Promise.all(
      functionCalls.map(async (fc) => {
        const result = await executeFunctionCall(fc.name!, fc.args ?? {});
        // Collect tours data for frontend cards
        if (fc.name === "search_tours" && result.tours) {
          tours = result.tours;
        } else if (fc.name === "get_tour_details" && result.tour) {
          tours = [result.tour];
        }
        return { functionResponse: { name: fc.name!, response: result } };
      })
    );

    contents = [
      ...contents,
      response.candidates![0].content!,
      { role: "user", parts: functionResponses },
    ];
  }

  return { reply: "Xin lỗi, tôi không thể xử lý yêu cầu này lúc này.", tours: tours.length ? tours : undefined };
}
