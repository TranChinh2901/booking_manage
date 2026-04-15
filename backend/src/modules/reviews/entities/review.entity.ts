import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";

import { Tour } from "@/modules/tours/entities/tour.entity";
import { User } from "@/modules/users/entities/user.entity";

export enum ReviewStatus {
  VISIBLE = "VISIBLE",
  HIDDEN = "HIDDEN",
}

@Entity("reviews")
@Unique(["userId", "tourId"])
export class Review {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column()
  tourId!: number;

  @ManyToOne(() => Tour, { onDelete: "CASCADE" })
  @JoinColumn({ name: "tourId" })
  tour!: Tour;

  @Column()
  rating!: number;

  @Column({ type: "text", nullable: true })
  comment?: string;

  @Column({
    type: "enum",
    enum: ReviewStatus,
    default: ReviewStatus.VISIBLE,
  })
  status!: ReviewStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
