import { PostStatus } from "../entities/post.entity";

export interface CreatePostDto {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  thumbnail?: string;
  status?: PostStatus;
}

export interface UpdatePostDto {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  thumbnail?: string;
  status?: PostStatus;
}

export interface PostQueryDto {
  keyword?: string;
  status?: PostStatus;
  page?: number;
  limit?: number;
}

export interface PostResponseDto {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  thumbnail?: string;
  status: PostStatus;
  createdAt: Date;
  updatedAt: Date;
}
