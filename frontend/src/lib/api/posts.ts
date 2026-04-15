import { apiFetch, toQueryString } from "./client";
import type { PaginatedItems, Post } from "./types";

export type PostListQuery = {
  keyword?: string;
  page?: number;
  limit?: number;
};

export function getPosts(query: PostListQuery = {}) {
  return apiFetch<PaginatedItems<Post>>(
    `/posts${toQueryString({
      keyword: query.keyword,
      page: query.page,
      limit: query.limit,
    })}`,
    { cache: "no-store" }
  );
}

export function getPostBySlug(slug: string) {
  return apiFetch<Post>(`/posts/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });
}
