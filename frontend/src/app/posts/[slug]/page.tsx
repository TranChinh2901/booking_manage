import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageShell } from "@/components/layout/page-shell";
import { Navbar } from "@/components/travel-landing/ui/navbar";
import { getPostBySlug } from "@/lib/api/posts";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

const fallbackPostImage =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=86";

type PostDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function loadPost(slug: string) {
  try {
    return await getPostBySlug(slug);
  } catch {
    return null;
  }
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { slug } = await params;
  const post = await loadPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <PageShell>
      <section className="relative px-4 pb-20 pt-5 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(135deg,#e0f7ff_0%,#fff7ed_48%,#ecfeff_100%)]" />
        <Navbar />

        <article className="mx-auto max-w-[1200px] pt-14">
          <Link className="text-sm font-black text-[#0e7490]" href="/posts">
            Back to posts
          </Link>
          <div className="mt-8 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#f97316]">
                {formatDate(post.createdAt)}
              </p>
              <h1 className="mt-3 text-4xl font-black leading-tight text-[#062f42] sm:text-6xl">
                {post.title}
              </h1>
              {post.excerpt ? (
                <p className="mt-5 max-w-2xl text-lg leading-8 text-[#496779]">
                  {post.excerpt}
                </p>
              ) : null}
            </div>

            <div className="relative min-h-[420px] overflow-hidden rounded-[8px] shadow-[0_28px_80px_rgba(12,74,110,0.18)]">
              <Image
                alt={post.title}
                className="object-cover"
                fill
                priority
                sizes="(min-width: 1024px) 570px, 94vw"
                src={post.thumbnail || fallbackPostImage}
              />
            </div>
          </div>

          <div
            className="rich-content mt-12 rounded-[8px] border border-[#dff3fa] bg-white p-6 shadow-[0_20px_55px_rgba(12,74,110,0.08)] lg:p-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </section>
    </PageShell>
  );
}
