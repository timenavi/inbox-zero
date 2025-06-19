import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/utils/prisma";
import { History } from "@/app/(app)/[emailAccountId]/automation/History";
import { Pending } from "@/app/(app)/[emailAccountId]/automation/Pending";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Rules } from "@/app/(app)/[emailAccountId]/automation/Rules";
import { Process } from "@/app/(app)/[emailAccountId]/automation/Process";
import { KnowledgeBase } from "@/app/(app)/[emailAccountId]/automation/knowledge/KnowledgeBase";
import { RulesPrompt } from "@/app/(app)/[emailAccountId]/automation/RulesPrompt";
import { OnboardingModal } from "@/components/OnboardingModal";
import { PermissionsCheck } from "@/app/(app)/[emailAccountId]/PermissionsCheck";
import { TabsToolbar } from "@/components/TabsToolbar";
import { GmailProvider } from "@/providers/GmailProvider";
import { ASSISTANT_ONBOARDING_COOKIE } from "@/utils/cookies";
import { prefixPath } from "@/utils/path";
import { Button } from "@/components/ui/button";
import { PlusIcon, SlidersIcon } from "lucide-react";
import Link from "next/link";

export const maxDuration = 300; // Applies to the actions

export default async function AutomationPage({
  params,
}: {
  params: Promise<{ emailAccountId: string }>;
}) {
  const { emailAccountId } = await params;

  // onboarding redirect
  const cookieStore = await cookies();
  const viewedOnboarding =
    cookieStore.get(ASSISTANT_ONBOARDING_COOKIE)?.value === "true";

  if (!viewedOnboarding) {
    const hasRule = await prisma.rule.findFirst({
      where: { emailAccountId },
      select: { id: true },
    });

    if (!hasRule) {
      redirect(prefixPath(emailAccountId, "/automation/onboarding"));
    }
  }

  const hasPendingRule = prisma.rule.findFirst({
    where: { emailAccountId, automate: false },
    select: { id: true },
  });

  return (
    <GmailProvider>
      <Suspense>
        <PermissionsCheck />

        <Tabs defaultValue="rules">
          <TabsToolbar>
            <div className="w-full overflow-x-auto">
              <TabsList>
                {/* <TabsTrigger value="prompt">Prompt</TabsTrigger> */}
                <TabsTrigger value="rules">Rules</TabsTrigger>
                <TabsTrigger value="test">Test</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <Suspense>
                  {(await hasPendingRule) && (
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                  )}
                </Suspense>
                <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex items-center gap-2">
              <Button asChild variant="outline">
                <Link
                  href={prefixPath(emailAccountId, "/automation/onboarding")}
                >
                  <SlidersIcon className="mr-2 hidden size-4 md:block" />
                  View Setup
                </Link>
              </Button>
              <Button asChild variant="default">
                <Link
                  href={prefixPath(emailAccountId, "/automation/rule/create")}
                >
                  <PlusIcon className="mr-2 hidden size-4 md:block" />
                  Add Rule
                </Link>
              </Button>
            </div>
          </TabsToolbar>

          {/* <TabsContent value="prompt" className="content-container mb-10">
            <RulesPrompt />
          </TabsContent> */}
          <TabsContent value="rules" className="content-container mb-10">
            <Rules />
          </TabsContent>
          <TabsContent value="test" className="content-container mb-10">
            <Process />
          </TabsContent>
          <TabsContent value="history" className="content-container mb-10">
            <History />
          </TabsContent>
          <Suspense>
            {(await hasPendingRule) && (
              <TabsContent value="pending" className="content-container mb-10">
                <Pending />
              </TabsContent>
            )}
          </Suspense>
          <TabsContent value="knowledge" className="content-container mb-10">
            <KnowledgeBase />
          </TabsContent>
        </Tabs>
      </Suspense>
    </GmailProvider>
  );
}
