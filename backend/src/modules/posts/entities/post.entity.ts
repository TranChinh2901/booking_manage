import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export enum PostStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  HIDDEN = "HIDDEN",
}

@Entity("posts")
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ unique: true })
  slug!: string;

  @Column({ type: "text", nullable: true })
  excerpt?: string;

  @Column({ type: "longtext" })
  content!: string;

  @Column({ nullable: true })
  thumbnail?: string;

  @Column({
    type: "enum",
    enum: PostStatus,
    default: PostStatus.DRAFT,
  })
  status!: PostStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
