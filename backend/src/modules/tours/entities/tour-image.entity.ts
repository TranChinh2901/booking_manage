import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Tour } from "./tour.entity";

@Entity("tour_images")
export class TourImage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  tourId!: number;

  @ManyToOne(() => Tour, (tour) => tour.images, { onDelete: "CASCADE" })
  @JoinColumn({ name: "tourId" })
  tour!: Tour;

  @Column()
  url!: string;

  @Column({ default: false })
  isThumbnail!: boolean;

  @Column({ default: 0 })
  sortOrder!: number;
}
