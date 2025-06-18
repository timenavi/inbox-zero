"use client";

import { FormWrapper } from "@/components/Form";
import { AboutSectionForm } from "@/app/(app)/[emailAccountId]/settings/AboutSectionForm";
// import { SignatureSectionForm } from "@/app/(app)/settings/SignatureSectionForm";
// import { LabelsSection } from "@/app/(app)/settings/LabelsSection";
import { DeleteSection } from "@/app/(app)/[emailAccountId]/settings/DeleteSection";
import { EmailUpdatesSection } from "@/app/(app)/[emailAccountId]/settings/EmailUpdatesSection";
import { MultiAccountSection } from "@/app/(app)/[emailAccountId]/settings/MultiAccountSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsToolbar } from "@/components/TabsToolbar";
import { useEmailAccountFull } from "@/hooks/useEmailAccountFull";
import { LoadingContent } from "@/components/LoadingContent";

export default function SettingsPage(_props: {
  params: Promise<{ emailAccountId: string }>;
}) {
  const { data, isLoading, error, mutate } = useEmailAccountFull();

  return (
    <Tabs defaultValue="email">
      <TabsToolbar>
        <div className="w-full overflow-x-auto">
          <TabsList>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="user">User</TabsTrigger>
          </TabsList>
        </div>
      </TabsToolbar>

      <TabsContent value="email" className="content-container mb-10">
        <LoadingContent loading={isLoading} error={error}>
          {data && (
            <FormWrapper>
              <AboutSectionForm about={data?.about} mutate={mutate} />
              {/* this is only used in Gmail when sending a new message. disabling for now. */}
              {/* <SignatureSectionForm signature={user.signature} /> */}
              {/* <LabelsSection /> */}
              <EmailUpdatesSection
                summaryEmailFrequency={data?.summaryEmailFrequency}
                mutate={mutate}
              />
              {/* <ResetAnalyticsSection /> */}
            </FormWrapper>
          )}
        </LoadingContent>
      </TabsContent>
      <TabsContent value="user">
        <FormWrapper>
          {/* <ModelSection /> */}
          <MultiAccountSection />
          {/* <WebhookSection /> */}
          {/* <ApiKeysSection /> */}
          <DeleteSection />
        </FormWrapper>
      </TabsContent>
    </Tabs>
  );
}
