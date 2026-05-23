import Image from "next/image";
import Link from "next/link";

import type { Post } from "@/lib/api/types";
import { formatDate } from "@/lib/format";

const fallbackPostImage =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=86";

type PostsSectionProps = {
  posts: Post[];
};

export function PostsSection({ posts }: PostsSectionProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#f97316]">
              Cẩm nang du lịch
            </p>
            <h2 className="mt-3 text-4xl font-black leading-tight text-[#062f42] sm:text-5xl">
              Đọc trước khi chọn lộ trình.
            </h2>
          </div>
          <Link className="text-sm font-black text-[#0e7490]" href="/posts">
            Xem tất cả bài viết
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {posts.map((post) => (
            <Link
              className="group overflow-hidden rounded-[8px] border border-[#dff3fa] bg-white shadow-[0_20px_55px_rgba(12,74,110,0.1)]"
              href={`/posts/${post.slug}`}
              key={post.id}
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  alt={post.title}
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.035]"
                  fill
                  sizes="(min-width: 768px) 380px, 94vw"
                  src={post.thumbnail || fallbackPostImage}
                />
              </div>
              <div className="p-5">
                <p className="text-sm font-black uppercase tracking-[0.14em] text-[#0e7490]">
                  {formatDate(post.createdAt)}
                </p>
                <h3 className="mt-2 text-2xl font-black leading-tight text-[#062f42]">
                  {post.title}
                </h3>
                <p className="mt-3 min-h-14 text-base font-semibold leading-7 text-[#496779]">
                  {post.excerpt || "Ghi chép du lịch, ý tưởng lên kế hoạch, và hướng dẫn điểm đến."}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
