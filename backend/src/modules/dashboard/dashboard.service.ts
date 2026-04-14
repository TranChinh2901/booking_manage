import { AppDataSource } from "@/config/config-database";
import {
  Booking,
  BookingStatus,
  PaymentStatus,
} from "@/modules/bookings/entities/booking.entity";
import { TourSchedule } from "@/modules/tour-schedules/entities/tour-schedule.entity";
import { Tour, TourStatus } from "@/modules/tours/entities/tour.entity";
import { User } from "@/modules/users/entities/user.entity";

export class DashboardService {
  async getSummary() {
    const userRepository = AppDataSource.getRepository(User);
    const tourRepository = AppDataSource.getRepository(Tour);
    const scheduleRepository = AppDataSource.getRepository(TourSchedule);
    const bookingRepository = AppDataSource.getRepository(Booking);

    const [
      totalUsers,
      totalTours,
      activeTours,
      totalSchedules,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
    ] = await Promise.all([
      userRepository.count(),
      tourRepository.count(),
      tourRepository.count({ where: { status: TourStatus.ACTIVE } }),
      scheduleRepository.count(),
      bookingRepository.count(),
      bookingRepository.count({ where: { status: BookingStatus.PENDING } }),
      bookingRepository.count({ where: { status: BookingStatus.CONFIRMED } }),
      bookingRepository.count({ where: { status: BookingStatus.COMPLETED } }),
    ]);

    const revenueResult = await bookingRepository
      .createQueryBuilder("booking")
      .select("COALESCE(SUM(booking.totalAmount), 0)", "totalRevenue")
      .where("booking.paymentStatus = :paymentStatus", {
        paymentStatus: PaymentStatus.PAID,
      })
      .getRawOne<{ totalRevenue: string }>();

    return {
      totalUsers,
      totalTours,
      activeTours,
      totalSchedules,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      totalRevenue: Number(revenueResult?.totalRevenue || 0),
    };
  }

  async getRevenueByMonth(year = new Date().getFullYear()) {
    const rows = await AppDataSource.getRepository(Booking)
      .createQueryBuilder("booking")
      .select("MONTH(booking.createdAt)", "month")
      .addSelect("COALESCE(SUM(booking.totalAmount), 0)", "revenue")
      .addSelect("COUNT(booking.id)", "bookingCount")
      .where("YEAR(booking.createdAt) = :year", { year })
      .andWhere("booking.paymentStatus = :paymentStatus", {
        paymentStatus: PaymentStatus.PAID,
      })
      .groupBy("MONTH(booking.createdAt)")
      .orderBy("month", "ASC")
      .getRawMany<{
        month: number;
        revenue: string;
        bookingCount: string;
      }>();

    return Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;
      const row = rows.find((item) => Number(item.month) === month);

      return {
        month,
        revenue: Number(row?.revenue || 0),
        bookingCount: Number(row?.bookingCount || 0),
      };
    });
  }

  async getTopTours(limit = 5) {
    const rows = await AppDataSource.getRepository(Booking)
      .createQueryBuilder("booking")
      .innerJoin("booking.tourSchedule", "schedule")
      .innerJoin("schedule.tour", "tour")
      .select("tour.id", "tourId")
      .addSelect("tour.title", "title")
      .addSelect("tour.slug", "slug")
      .addSelect("SUM(booking.adultCount + booking.childCount)", "totalGuests")
      .addSelect("COUNT(booking.id)", "bookingCount")
      .where("booking.status != :cancelledStatus", {
        cancelledStatus: BookingStatus.CANCELLED,
      })
      .groupBy("tour.id")
      .addGroupBy("tour.title")
      .addGroupBy("tour.slug")
      .orderBy("totalGuests", "DESC")
      .limit(limit)
      .getRawMany<{
        tourId: number;
        title: string;
        slug: string;
        totalGuests: string;
        bookingCount: string;
      }>();

    return rows.map((row) => ({
      tourId: Number(row.tourId),
      title: row.title,
      slug: row.slug,
      totalGuests: Number(row.totalGuests),
      bookingCount: Number(row.bookingCount),
    }));
  }
}

export default new DashboardService();
