import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  Column,
} from "typeorm";

import { Tour } from "@/modules/tours/entities/tour.entity";
import { User } from "@/modules/users/entities/user.entity";

@Entity("favorites")
@Unique(["userId", "tourId"])
export class Favorite {
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

  @CreateDateColumn()
  createdAt!: Date;
}
