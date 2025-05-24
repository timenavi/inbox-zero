import type { Metadata } from "next";
import { TermsContent } from "@/app/(landing)/terms/content";

export const metadata: Metadata = {
  title: "Terms of Service - AI Email Writer",
  description: "Terms of Service - AI Email Writer",
  alternates: { canonical: "/terms" },
};

export default function Page() {
  return <TermsContent />;
}
