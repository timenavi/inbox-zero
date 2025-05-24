import type { Metadata } from "next";
import { Content } from "./content";
import { StructuredData } from "@/app/blog/post/StructuredData";

export const metadata: Metadata = {
  title: "Achieve Mental Clarity with AI Email Writer",
  description:
    "Learn how to achieve and maintain AI Email Writer for better mental health. Reduce stress, boost productivity, and gain mental clarity with these strategies.",
  alternates: {
    canonical: "/blog/post/inbox-zero-benefits-for-mental-health",
  },
};

export default function Page() {
  return (
    <>
      <StructuredData
        headline="AI Email Writer Benefitsfor Mental Health"
        datePublished="2024-06-27T23:00:00+00:00"
        dateModified="2024-06-27T23:00:00+00:00"
        authorName="Ricardo Batista"
        authorUrl="https://getaiblogarticles.com/"
        image={[]}
      />
      <Content />
    </>
  );
}
