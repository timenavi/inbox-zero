import type { Post as PostType } from "@/app/blog/types";
import { BlogLayout } from "@/components/layouts/BlogLayout";
import { Card, CardContent } from "@/components/ui/card";
import { sanityFetch } from "@/sanity/lib/fetch";
import { postsQuery } from "@/sanity/lib/queries";
import Image from "next/image";
import Link from "next/link";

type Post = {
  title: string;
  file: string;
  description: string;
  date: string;
  datetime: string;
  author: { name: string; role: string; href: string; imageUrl: string };
  imageUrl: string;
};

type SanityPost = {
  title: string;
  description: string | null;
  slug: { current: string; _type: "slug" };
  mainImage: PostType["mainImage"];
  imageURL: string | null;
  authorName: string;
  _createdAt: string;
};

const mdxPosts: Post[] = [];

export const revalidate = 60;

export default async function BlogContentsPage() {
  // Skip Sanity fetch during build with dummy credentials
  let posts: SanityPost[] = [];
  if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== "project123") {
    posts = await sanityFetch<SanityPost[]>({ query: postsQuery });
  }

  return (
    <BlogLayout>
      <Posts posts={posts} />
    </BlogLayout>
  );
}

function Posts({ posts }: { posts: SanityPost[] }) {
  const allPosts: Post[] = [
    ...posts.map((post) => ({
      title: post.title,
      file: post.slug.current,
      description: post.description ?? "",
      date: new Date(post._createdAt).toLocaleDateString(),
      datetime: post._createdAt,
      author: {
        name: post.authorName,
        role: "Founder",
        href: "#",
        imageUrl: "/images/blog/elie-profile.jpg",
      },
      imageUrl: post.imageURL ?? "/images/reach-inbox-zero.png",
    })),
    ...mdxPosts,
  ];

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="mb-8 font-cal text-3xl tracking-tight text-gray-900 sm:text-4xl">
          From the blog
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allPosts.map((post) => (
            <PostCard key={post.title} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <Card className="overflow-hidden transition-transform duration-300 hover:scale-105">
      <Link href={`/blog/post/${post.file}`}>
        <div className="relative h-48 w-full">
          <Image
            src={post.imageUrl}
            alt={post.title}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <CardContent className="pt-4">
          <h3 className="mb-2 font-cal text-lg leading-6 text-gray-900 group-hover:text-gray-600">
            {post.title}
          </h3>
          <p className="mb-4 line-clamp-2 text-sm leading-6 text-gray-600">
            {post.description}
          </p>
          <div className="flex items-center gap-x-4">
            <Image
              src={post.author.imageUrl}
              alt=""
              className="h-8 w-8 rounded-full bg-gray-50"
              width={32}
              height={32}
            />
            <div className="text-sm">
              <p className="font-semibold text-gray-900">{post.author.name}</p>
              <time dateTime={post.datetime} className="text-gray-500">
                {post.date}
              </time>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
