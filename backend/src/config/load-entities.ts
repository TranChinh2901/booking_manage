import { Booking } from "@/modules/bookings/entities/booking.entity";
import { BookingTraveler } from "@/modules/booking-travelers/entities/booking-traveler.entity";
import { Category } from "@/modules/categories/entities/category.entity";
import { ContactRequest } from "@/modules/contact-requests/entities/contact-request.entity";
import { Destination } from "@/modules/destinations/entities/destination.entity";
import { Favorite } from "@/modules/favorites/entities/favorite.entity";
import { Payment } from "@/modules/payments/entities/payment.entity";
import { Post } from "@/modules/posts/entities/post.entity";
import { Review } from "@/modules/reviews/entities/review.entity";
import { TourSchedule } from "@/modules/tour-schedules/entities/tour-schedule.entity";
import { TourImage } from "@/modules/tours/entities/tour-image.entity";
import { Tour } from "@/modules/tours/entities/tour.entity";
import { User } from "@/modules/users/entities/user.entity";

export const entities = [
  User,
  Destination,
  Category,
  Tour,
  TourImage,
  TourSchedule,
  Booking,
  BookingTraveler,
  Payment,
  Review,
  Favorite,
  Post,
  ContactRequest,
];
