import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export enum ContactRequestStatus {
  NEW = "NEW",
  PROCESSING = "PROCESSING",
  DONE = "DONE",
}

@Entity("contact_requests")
export class ContactRequest {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column({ nullable: true })
  phone?: string;

  @Column()
  subject!: string;

  @Column({ type: "text" })
  message!: string;

  @Column({
    type: "enum",
    enum: ContactRequestStatus,
    default: ContactRequestStatus.NEW,
  })
  status!: ContactRequestStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
