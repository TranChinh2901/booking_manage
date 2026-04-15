import { PostResponseDto } from "./dto/post.dto";
import { Post } from "./entities/post.entity";

export const toPostResponseDto = (post: Post): PostResponseDto => {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    thumbnail: post.thumbnail,
    status: post.status,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
};
