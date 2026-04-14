import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Tour } from "@/modules/tours/entities/tour.entity";

export enum DestinationStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

@Entity("destinations")
export class Destination {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  slug!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({
    type: "enum",
    enum: DestinationStatus,
    default: DestinationStatus.ACTIVE,
  })
  status!: DestinationStatus;

  @OneToMany(() => Tour, (tour) => tour.destination)
  tours!: Tour[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
