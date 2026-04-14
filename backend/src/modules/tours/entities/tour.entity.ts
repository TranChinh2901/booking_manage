import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Category } from "@/modules/categories/entities/category.entity";
import { Destination } from "@/modules/destinations/entities/destination.entity";

import { TourImage } from "./tour-image.entity";

export enum TourStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

@Entity("tours")
export class Tour {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ unique: true })
  slug!: string;

  @Column({ type: "text", nullable: true })
  shortDescription?: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column()
  destinationId!: number;

  @ManyToOne(() => Destination, (destination) => destination.tours)
  @JoinColumn({ name: "destinationId" })
  destination!: Destination;

  @Column()
  categoryId!: number;

  @ManyToOne(() => Category, (category) => category.tours)
  @JoinColumn({ name: "categoryId" })
  category!: Category;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  priceAdult!: string;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  priceChild!: string;

  @Column({ default: 1 })
  durationDays!: number;

  @Column({ default: 0 })
  durationNights!: number;

  @Column({ nullable: true })
  departureLocation?: string;

  @Column({ nullable: true })
  transport?: string;

  @Column({ default: 0 })
  maxPeople!: number;

  @Column({
    type: "enum",
    enum: TourStatus,
    default: TourStatus.DRAFT,
  })
  status!: TourStatus;

  @OneToMany(() => TourImage, (image) => image.tour, { cascade: true })
  images!: TourImage[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
