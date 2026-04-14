import "reflect-metadata";
import bcrypt from "bcryptjs";

import { AppDataSource } from "@/config/config-database";
import {
  Category,
  CategoryStatus,
} from "@/modules/categories/entities/category.entity";
import {
  Destination,
  DestinationStatus,
} from "@/modules/destinations/entities/destination.entity";
import {
  TourSchedule,
  TourScheduleStatus,
} from "@/modules/tour-schedules/entities/tour-schedule.entity";
import { TourImage } from "@/modules/tours/entities/tour-image.entity";
import { Tour, TourStatus } from "@/modules/tours/entities/tour.entity";
import {
  User,
  UserRole,
  UserStatus,
} from "@/modules/users/entities/user.entity";
import { logger } from "@/utils/logger";

const demoPassword = "123456";

const users = [
  {
    name: "Admin Demo",
    email: "admin@example.com",
    role: UserRole.ADMIN,
    phone: "0900000001",
  },
  {
    name: "Staff Demo",
    email: "staff@example.com",
    role: UserRole.STAFF,
    phone: "0900000002",
  },
  {
    name: "Customer Demo",
    email: "customer@example.com",
    role: UserRole.CUSTOMER,
    phone: "0900000003",
  },
];

const destinations = [
  {
    name: "Da Nang",
    slug: "da-nang",
    description: "Thanh pho bien nang dong voi nhieu diem du lich noi tieng.",
    image:
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=1200",
  },
  {
    name: "Da Lat",
    slug: "da-lat",
    description: "Thanh pho cao nguyen khi hau mat me, phu hop nghi duong.",
    image:
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=1200",
  },
  {
    name: "Phu Quoc",
    slug: "phu-quoc",
    description: "Dao ngoc voi bien xanh, cat trang va cac resort ven bien.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200",
  },
  {
    name: "Ha Noi",
    slug: "ha-noi",
    description: "Thu do ngan nam van hien voi nhieu di san va am thuc dac sac.",
    image:
      "https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=1200",
  },
];

const categories = [
  {
    name: "Du lich bien",
    slug: "du-lich-bien",
    description: "Tour nghi duong, tam bien va trai nghiem dao.",
  },
  {
    name: "Du lich nghi duong",
    slug: "du-lich-nghi-duong",
    description: "Tour khach san, resort va lich trinh nhe nha.",
  },
  {
    name: "Du lich kham pha",
    slug: "du-lich-kham-pha",
    description: "Tour tham quan, trai nghiem van hoa va thien nhien.",
  },
];

const tours = [
  {
    title: "Da Nang - Hoi An 3 ngay 2 dem",
    slug: "da-nang-hoi-an-3-ngay-2-dem",
    shortDescription: "Kham pha Da Nang, pho co Hoi An va cau Rong ve dem.",
    description:
      "Lich trinh phu hop gia dinh, ket hop tham quan Ba Na Hills, bien My Khe va pho co Hoi An.",
    destinationSlug: "da-nang",
    categorySlug: "du-lich-kham-pha",
    priceAdult: 3490000,
    priceChild: 2490000,
    durationDays: 3,
    durationNights: 2,
    departureLocation: "TP Ho Chi Minh",
    transport: "May bay, xe du lich",
    maxPeople: 30,
    images: [
      "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200",
      "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1200",
    ],
  },
  {
    title: "Da Lat nghi duong 3 ngay 2 dem",
    slug: "da-lat-nghi-duong-3-ngay-2-dem",
    shortDescription: "Tan huong khong khi Da Lat, tham quan vuon hoa va ho.",
    description:
      "Tour nghi duong Da Lat voi lich trinh nhe, phu hop cap doi va gia dinh.",
    destinationSlug: "da-lat",
    categorySlug: "du-lich-nghi-duong",
    priceAdult: 2890000,
    priceChild: 1990000,
    durationDays: 3,
    durationNights: 2,
    departureLocation: "TP Ho Chi Minh",
    transport: "Xe giuong nam",
    maxPeople: 35,
    images: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200",
    ],
  },
  {
    title: "Phu Quoc bien dao 4 ngay 3 dem",
    slug: "phu-quoc-bien-dao-4-ngay-3-dem",
    shortDescription: "Nghi duong bien dao, cap treo Hon Thom va Grand World.",
    description:
      "Lich trinh bien dao Phu Quoc ket hop vui choi, nghi duong va trai nghiem am thuc hai san.",
    destinationSlug: "phu-quoc",
    categorySlug: "du-lich-bien",
    priceAdult: 5290000,
    priceChild: 3890000,
    durationDays: 4,
    durationNights: 3,
    departureLocation: "Ha Noi",
    transport: "May bay, xe du lich",
    maxPeople: 25,
    images: [
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1200",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200",
    ],
  },
];

const addDays = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

const main = async () => {
  await AppDataSource.initialize();

  const userRepository = AppDataSource.getRepository(User);
  const destinationRepository = AppDataSource.getRepository(Destination);
  const categoryRepository = AppDataSource.getRepository(Category);
  const tourRepository = AppDataSource.getRepository(Tour);
  const scheduleRepository = AppDataSource.getRepository(TourSchedule);

  const hashedPassword = await bcrypt.hash(demoPassword, 10);

  for (const user of users) {
    const exists = await userRepository.findOne({ where: { email: user.email } });
    if (!exists) {
      await userRepository.save(
        userRepository.create({
          ...user,
          password: hashedPassword,
          status: UserStatus.ACTIVE,
        })
      );
    }
  }

  for (const destination of destinations) {
    const exists = await destinationRepository.findOne({
      where: { slug: destination.slug },
    });
    if (!exists) {
      await destinationRepository.save(
        destinationRepository.create({
          ...destination,
          status: DestinationStatus.ACTIVE,
        })
      );
    }
  }

  for (const category of categories) {
    const exists = await categoryRepository.findOne({
      where: { slug: category.slug },
    });
    if (!exists) {
      await categoryRepository.save(
        categoryRepository.create({
          ...category,
          status: CategoryStatus.ACTIVE,
        })
      );
    }
  }

  for (const tourSeed of tours) {
    const exists = await tourRepository.findOne({
      where: { slug: tourSeed.slug },
    });

    if (exists) {
      continue;
    }

    const destination = await destinationRepository.findOneOrFail({
      where: { slug: tourSeed.destinationSlug },
    });
    const category = await categoryRepository.findOneOrFail({
      where: { slug: tourSeed.categorySlug },
    });

    const tour = await tourRepository.save(
      tourRepository.create({
        title: tourSeed.title,
        slug: tourSeed.slug,
        shortDescription: tourSeed.shortDescription,
        description: tourSeed.description,
        destinationId: destination.id,
        categoryId: category.id,
        priceAdult: String(tourSeed.priceAdult),
        priceChild: String(tourSeed.priceChild),
        durationDays: tourSeed.durationDays,
        durationNights: tourSeed.durationNights,
        departureLocation: tourSeed.departureLocation,
        transport: tourSeed.transport,
        maxPeople: tourSeed.maxPeople,
        status: TourStatus.ACTIVE,
        images: tourSeed.images.map((url, index) =>
          AppDataSource.getRepository(TourImage).create({
            url,
            isThumbnail: index === 0,
            sortOrder: index,
          })
        ),
      })
    );

    const scheduleOffsets = [14, 28, 42];
    for (const offset of scheduleOffsets) {
      const scheduleExists = await scheduleRepository.findOne({
        where: {
          tourId: tour.id,
          startDate: addDays(offset),
        },
      });

      if (!scheduleExists) {
        await scheduleRepository.save(
          scheduleRepository.create({
            tourId: tour.id,
            startDate: addDays(offset),
            endDate: addDays(offset + tour.durationDays - 1),
            availableSeats: tour.maxPeople,
            bookedSeats: 0,
            priceAdult: tour.priceAdult,
            priceChild: tour.priceChild,
            status: TourScheduleStatus.OPEN,
          })
        );
      }
    }
  }

  logger.success("Seed data created successfully");
  logger.log(`Demo password for all accounts: ${demoPassword}`);

  await AppDataSource.destroy();
};

main().catch(async (error) => {
  logger.error(`Seed failed: ${error}`);
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
  process.exit(1);
});
