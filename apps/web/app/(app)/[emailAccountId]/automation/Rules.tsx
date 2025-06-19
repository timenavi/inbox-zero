"use client";

import Link from "next/link";
import { toast } from "sonner";
import { capitalCase } from "capital-case";
import {
  MoreHorizontalIcon,
  PenIcon,
  PlusIcon,
  HistoryIcon,
  Trash2Icon,
  ToggleRightIcon,
  ToggleLeftIcon,
  SlidersIcon,
} from "lucide-react";
import { LoadingContent } from "@/components/LoadingContent";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  setRuleRunOnThreadsAction,
  setRuleEnabledAction,
} from "@/utils/actions/ai-rule";
import { deleteRuleAction } from "@/utils/actions/rule";
import { Toggle } from "@/components/Toggle";
import { conditionsToString } from "@/utils/condition";
import { Badge } from "@/components/Badge";
import { getActionColor } from "@/components/PlanBadge";
import { PremiumAlertWithData } from "@/components/PremiumAlert";
import { toastError, toastSuccess } from "@/components/Toast";
import { Tooltip } from "@/components/Tooltip";
import type { RiskLevel } from "@/utils/risk";
import { useRules } from "@/hooks/useRules";
import { ActionType } from "@prisma/client";
import { ThreadsExplanation } from "@/app/(app)/[emailAccountId]/automation/RuleForm";
import { useAction } from "next-safe-action/hooks";
import { useAccount } from "@/providers/EmailAccountProvider";
import { prefixPath } from "@/utils/path";
import { ExpandableText } from "@/components/ExpandableText";
import { OnboardingModal } from "@/components/OnboardingModal";

export function Rules({ size = "md" }: { size?: "sm" | "md" }) {
  const { data, isLoading, error, mutate } = useRules();

  const hasRules = !!data?.length;

  const { emailAccountId } = useAccount();
  const { executeAsync: setRuleRunOnThreads } = useAction(
    setRuleRunOnThreadsAction.bind(null, emailAccountId),
  );
  const { executeAsync: setRuleEnabled } = useAction(
    setRuleEnabledAction.bind(null, emailAccountId),
  );
  const { executeAsync: deleteRule } = useAction(
    deleteRuleAction.bind(null, emailAccountId),
  );

  return (
    <div className="pb-4">
      <Card>
        <LoadingContent loading={isLoading} error={error}>
          {hasRules ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  {size === "md" && <TableHead>Condition</TableHead>}
                  <TableHead>Action</TableHead>
                  {size === "md" && (
                    <TableHead>
                      <div className="flex items-center justify-center gap-1">
                        <span>Threads</span>
                        <ThreadsExplanation size="sm" />
                      </div>
                    </TableHead>
                  )}
                  <TableHead>
                    <span className="sr-only">User Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data
                  ?.sort((a, b) => (b.enabled ? 1 : 0) - (a.enabled ? 1 : 0))
                  .map((rule) => (
                    <TableRow
                      key={rule.id}
                      className={!rule.enabled ? "bg-muted opacity-60" : ""}
                    >
                      <TableCell className="font-medium">
                        <Link
                          href={prefixPath(
                            emailAccountId,
                            `/automation/rule/${rule.id}`,
                          )}
                          className="flex items-center gap-2"
                        >
                          {!rule.enabled && (
                            <Badge color="red" className="mr-2">
                              Disabled
                            </Badge>
                          )}
                          {rule.name}
                          {!rule.automate && (
                            <Tooltip content="Actions for matched emails will require manual approval in the 'Pending' tab.">
                              <Badge
                                color="yellow"
                                className="ml-auto text-nowrap"
                              >
                                Requires Approval
                              </Badge>
                            </Tooltip>
                          )}
                        </Link>
                      </TableCell>
                      {size === "md" && (
                        <TableCell className="whitespace-pre-wrap">
                          <ExpandableText text={conditionsToString(rule)} />
                        </TableCell>
                      )}
                      <TableCell>
                        <ActionBadges actions={rule.actions} />
                      </TableCell>
                      {size === "md" && (
                        <TableCell>
                          <div className="flex justify-center">
                            <Toggle
                              enabled={rule.runOnThreads}
                              name="runOnThreads"
                              onChange={async () => {
                                const result = await setRuleRunOnThreads({
                                  ruleId: rule.id,
                                  runOnThreads: !rule.runOnThreads,
                                });

                                if (result?.serverError) {
                                  toastError({
                                    description: `There was an error updating your rule. ${result.serverError || ""}`,
                                  });
                                }
                                mutate();
                              }}
                            />
                          </div>
                        </TableCell>
                      )}
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontalIcon className="size-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link
                                href={prefixPath(
                                  emailAccountId,
                                  `/automation/rule/${rule.id}`,
                                )}
                              >
                                <PenIcon className="mr-2 size-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={prefixPath(
                                  emailAccountId,
                                  `/automation?tab=history&ruleId=${rule.id}`,
                                )}
                              >
                                <HistoryIcon className="mr-2 size-4" />
                                History
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={async () => {
                                const result = await setRuleEnabled({
                                  ruleId: rule.id,
                                  enabled: !rule.enabled,
                                });

                                if (result?.serverError) {
                                  toastError({
                                    description: `There was an error ${
                                      rule.enabled ? "disabling" : "enabling"
                                    } your rule. ${result.serverError || ""}`,
                                  });
                                } else {
                                  toastSuccess({
                                    description: `Rule ${
                                      rule.enabled ? "disabled" : "enabled"
                                    }!`,
                                  });
                                }

                                mutate();
                              }}
                            >
                              {rule.enabled ? (
                                <ToggleRightIcon className="mr-2 size-4" />
                              ) : (
                                <ToggleLeftIcon className="mr-2 size-4" />
                              )}
                              {rule.enabled ? "Disable" : "Enable"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={async () => {
                                const yes = confirm(
                                  "Are you sure you want to delete this rule?",
                                );
                                if (yes) {
                                  toast.promise(
                                    async () => {
                                      const res = await deleteRule({
                                        id: rule.id,
                                      });

                                      if (
                                        res?.serverError ||
                                        res?.validationErrors ||
                                        res?.bindArgsValidationErrors
                                      ) {
                                        throw new Error(
                                          res?.serverError ||
                                            "There was an error deleting your rule",
                                        );
                                      }

                                      mutate();
                                    },
                                    {
                                      loading: "Deleting rule...",
                                      success: "Rule deleted",
                                      error: (error) =>
                                        `Error deleting rule. ${error.message}`,
                                      finally: () => {
                                        mutate();
                                      },
                                    },
                                  );
                                }
                              }}
                            >
                              <Trash2Icon className="mr-2 size-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <NoRules />
          )}
        </LoadingContent>
      </Card>

      {hasRules && (
        <div className="my-2 flex justify-end gap-2">
          {/* <Button asChild variant="outline">
            <Link href={prefixPath(emailAccountId, "/automation?tab=prompt")}>
              <PenIcon className="mr-2 hidden size-4 md:block" />
              Add Rule via Prompt
            </Link>
          </Button> */}
          <OnboardingModal
            title="Getting started with AI Personal Assistant"
            description={
              <>
                Learn how to use the AI Personal Assistant to automatically
                label, archive, and more.
              </>
            }
            videoId="SoeNDVr7ve4"
          />
        </div>
      )}
    </div>
  );
}

export function ActionBadges({
  actions,
}: {
  actions: {
    id: string;
    type: ActionType;
    label?: string | null;
  }[];
}) {
  return (
    <div className="flex flex-1 space-x-2">
      {actions.map((action) => {
        // Hidden for simplicity
        if (action.type === ActionType.TRACK_THREAD) return null;

        return (
          <Badge
            key={action.id}
            color={getActionColor(action.type)}
            className="text-nowrap"
          >
            {capitalCase(action.type)}
            {action.label && `: ${action.label}`}
          </Badge>
        );
      })}
    </div>
  );
}

function NoRules() {
  const { emailAccountId } = useAccount();
  return (
    <>
      <CardHeader>
        <CardDescription>
          You don't have any rules yet.
          <br />
          You can teach your AI assistant how to handle your emails by chatting
          with it or create rules manually.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button type="button" variant="outline" asChild>
          <Link href={prefixPath(emailAccountId, "/automation/rule/create")}>
            Add Rule
          </Link>
        </Button>
      </CardContent>
    </>
  );
}
