import { sanityFetch } from "@/sanity/lib/fetch";
import { postSlugsQuery } from "@/sanity/lib/queries";
import type { MetadataRoute } from "next";
import { unstable_noStore } from "next/cache";

async function getBlogPosts() {
  // Skip Sanity fetch during build with dummy credentials
  if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === "project123") {
    return []; // Return empty array directly
  }
  const posts = await sanityFetch<{ slug: string; date: string }[]>({
    query: postSlugsQuery,
  });
  return posts.map((post) => ({
    url: `https://app.replyai.ai/blog/post/${post.slug}`,
    lastModified: new Date(post.date),
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // to try fix caching issue: https://github.com/vercel/next.js/discussions/56708#discussioncomment-10127496
  unstable_noStore();

  const blogPosts = await getBlogPosts();

  const staticUrls = [
    {
      url: "https://app.replyai.ai/",
      priority: 1,
    },
    {
      url: "https://app.replyai.ai/bulk-email-unsubscriber",
    },
    {
      url: "https://app.replyai.ai/ai-automation",
    },
    {
      url: "https://app.replyai.ai/email-analytics",
    },
    {
      url: "https://app.replyai.ai/block-cold-emails",
    },
    {
      url: "https://app.replyai.ai/privacy",
    },
    {
      url: "https://app.replyai.ai/terms",
    },
    {
      url: "https://app.replyai.ai/blog",
      changeFrequency: "daily",
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: "https://app.replyai.ai/blog/post/how-my-open-source-saas-hit-first-on-product-hunt",
    },
    {
      url: "https://app.replyai.ai/blog/post/why-build-an-open-source-saas",
    },
    {
      url: "https://app.replyai.ai/blog/post/alternatives-to-skiff-mail",
    },
    {
      url: "https://app.replyai.ai/blog/post/best-email-unsubscribe-app",
    },
    {
      url: "https://app.replyai.ai/blog/post/bulk-unsubscribe-from-emails",
    },
    {
      url: "https://app.replyai.ai/blog/post/escape-email-trap-unsubscribe-for-good",
    },
    {
      url: "https://docs.replyai.ai/",
    },
    {
      url: "https://docs.replyai.ai/introduction",
    },
    {
      url: "https://docs.replyai.ai/essentials/email-ai-automation",
    },
    {
      url: "https://docs.replyai.ai/essentials/bulk-email-unsubscriber",
    },
    {
      url: "https://docs.replyai.ai/essentials/cold-email-blocker",
    },
  ];

  return [...staticUrls, ...blogPosts];
}
