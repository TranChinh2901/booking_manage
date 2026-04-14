import { Category } from "@/modules/categories/entities/category.entity";
import { Destination } from "@/modules/destinations/entities/destination.entity";
import { TourImage } from "@/modules/tours/entities/tour-image.entity";
import { Tour } from "@/modules/tours/entities/tour.entity";
import { User } from "@/modules/users/entities/user.entity";

export const entities = [User, Destination, Category, Tour, TourImage];
