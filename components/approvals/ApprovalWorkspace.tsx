"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  FileCheck2,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { approvalService } from "@/services/approval";
import type {
  Approval,
  ApprovalStatus,
  ApprovalWorkflowState,
} from "@/types/common";
import type { ApprovalRecommendationResponse } from "@/types/response";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type StatusFilter = ApprovalStatus | "ALL";
type WorkflowFilter = ApprovalWorkflowState | "ALL";
type ApprovalAction =
  | "RECOMMEND_APPROVAL"
  | "RECOMMEND_REJECTION"
  | "APPROVE"
  | "REJECT";

const PAGE_SIZE = 20;

const statusStyles: Record<ApprovalStatus, string> = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-700",
  APPROVED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  REJECTED: "border-rose-200 bg-rose-50 text-rose-700",
};

const workflowLabels: Record<string, string> = {
  PENDING_MAKER_REVIEW: "Maker Review",
  PENDING_CHECKER_REVIEW: "Checker Review",
  APPROVE: "Approved",
  REJECT: "Rejected",
};

const actionCopy: Record<ApprovalAction, { label: string; title: string }> = {
  RECOMMEND_APPROVAL: {
    label: "Recommend approval",
    title: "Recommend this request for approval?",
  },
  RECOMMEND_REJECTION: {
    label: "Recommend rejection",
    title: "Recommend this request for rejection?",
  },
  APPROVE: { label: "Approve request", title: "Approve this request?" },
  REJECT: { label: "Reject request", title: "Reject this request?" },
};

const formatDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const humanize = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const getActions = (approval: ApprovalRecommendationResponse | null) => {
  if (!approval || approval.approvalStatus !== "PENDING") return [];
  if (approval.workflowState === "PENDING_MAKER_REVIEW") {
    return ["RECOMMEND_APPROVAL", "RECOMMEND_REJECTION"] as ApprovalAction[];
  }
  if (approval.workflowState === "PENDING_CHECKER_REVIEW") {
    return ["APPROVE", "REJECT"] as ApprovalAction[];
  }
  return [];
};

function StatusBadge({ status }: { status: ApprovalStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn("rounded-full px-2.5 py-1", statusStyles[status])}
    >
      {humanize(status)}
    </Badge>
  );
}

function TableLoading() {
  return Array.from({ length: 6 }).map((_, index) => (
    <TableRow key={index}>
      {Array.from({ length: 7 }).map((__, cell) => (
        <TableCell key={cell}>
          <Skeleton className="h-4 w-full max-w-32" />
        </TableCell>
      ))}
    </TableRow>
  ));
}

function DataComparison({
  approval,
}: {
  approval: ApprovalRecommendationResponse;
}) {
  const keys = Array.from(
    new Set([
      ...Object.keys(approval.oldData ?? {}),
      ...Object.keys(approval.newData ?? {}),
    ]),
  ).filter((key) => key !== "files");

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="grid grid-cols-[minmax(110px,0.7fr)_1fr_1fr] bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <div className="px-4 py-3">Field</div>
        <div className="border-l px-4 py-3">Previous</div>
        <div className="border-l px-4 py-3">Requested</div>
      </div>
      {keys.length === 0 ? (
        <p className="border-t px-4 py-6 text-sm text-slate-500">
          No profile changes were supplied.
        </p>
      ) : (
        keys.map((key) => {
          const oldValue = (approval.oldData as Record<string, unknown>)[key];
          const newValue = (
            approval.newData as unknown as Record<string, unknown>
          )[key];
          const changed = String(oldValue ?? "") !== String(newValue ?? "");
          return (
            <div
              key={key}
              className="grid grid-cols-[minmax(110px,0.7fr)_1fr_1fr] border-t text-sm"
            >
              <div className="px-4 py-3 font-medium text-slate-600">
                {humanize(key)}
              </div>
              <div className="min-w-0 border-l px-4 py-3 text-slate-500 break-words">
                {String(oldValue ?? "—")}
              </div>
              <div
                className={cn(
                  "min-w-0 border-l px-4 py-3 font-medium break-words text-slate-900",
                  changed && "bg-blue-50/60 text-[#193F7F]",
                )}
              >
                {String(newValue ?? "—")}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default function ApprovalWorkspace() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [workflow, setWorkflow] = useState<WorkflowFilter>("ALL");
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [cursor, setCursor] = useState<string | undefined>();
  const [cursorHistory, setCursorHistory] = useState<(string | undefined)[]>(
    [],
  );
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [details, setDetails] = useState<ApprovalRecommendationResponse | null>(
    null,
  );
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [pendingAction, setPendingAction] = useState<ApprovalAction | null>(
    null,
  );
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(query.trim()), 450);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setCursor(undefined);
    setCursorHistory([]);
  }, [status, workflow, search, fromDate, toDate]);

  const loadApprovals = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await approvalService.getApprovals({
        approvalStatus: status === "ALL" ? undefined : status,
        workflowState: workflow === "ALL" ? undefined : workflow,
        approvalType: "CIB_ADMIN_APPLICATION",
        corporateName: search || undefined,
        requestedFrom: fromDate ? new Date(`${fromDate}T00:00:00`) : undefined,
        requestedTo: toDate ? new Date(`${toDate}T23:59:59`) : undefined,
        limit: PAGE_SIZE,
        cursor,
      });
      setApprovals(response.data.items ?? []);
      setNextCursor(response.data.nextCursor);
    } catch {
      setError(
        "We couldn’t load approval requests. Check your connection and try again.",
      );
      setApprovals([]);
      setNextCursor(null);
    } finally {
      setLoading(false);
    }
  }, [cursor, fromDate, search, status, toDate, workflow]);

  useEffect(() => {
    void loadApprovals();
  }, [loadApprovals]);

  const loadDetails = useCallback(async (id: string) => {
    try {
      setDetailsLoading(true);
      setDetailsError("");
      const response = await approvalService.getApprovalByRequestId(id);
      setDetails(response.data);
    } catch {
      setDetailsError("We couldn’t load this request’s details.");
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedId) void loadDetails(selectedId);
  }, [loadDetails, selectedId]);

  const actions = useMemo(() => getActions(details), [details]);
  const currentPage = cursorHistory.length + 1;

  const closeDetails = (open: boolean) => {
    if (open) return;
    setSelectedId(null);
    setDetails(null);
    setDetailsError("");
    setPendingAction(null);
    setComment("");
  };

  const submitAction = async () => {
    if (!details || !pendingAction) return;
    if (!comment.trim()) {
      toast.error("Add a comment before submitting your decision.");
      return;
    }
    try {
      setSubmitting(true);
      if (pendingAction.startsWith("RECOMMEND_")) {
        await approvalService.recordMakerRecommendation(
          details.approvalRequestId,
          {
            action: pendingAction as
              | "RECOMMEND_APPROVAL"
              | "RECOMMEND_REJECTION",
            comment: comment.trim(),
          },
        );
      } else {
        await approvalService.recordCheckerRecommendation(
          details.approvalRequestId,
          {
            action: pendingAction as "APPROVE" | "REJECT",
            comment: comment.trim(),
          },
        );
      }
      const statusResponse = await approvalService.getApprovalStatus(
        details.approvalRequestId,
      );
      toast.success(
        `${actionCopy[pendingAction].label} submitted successfully.`,
      );
      setApprovals((items) =>
        items.map((item) =>
          item.approvalRequestId === details.approvalRequestId
            ? { ...item, approvalStatus: statusResponse.data.approvalStatus }
            : item,
        ),
      );
      setPendingAction(null);
      setComment("");
      await Promise.all([
        loadDetails(details.approvalRequestId),
        loadApprovals(),
      ]);
    } catch {
      toast.error(
        "The approval action could not be submitted. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Operations</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            Approvals
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Review corporate admin applications and record maker-checker
            decisions.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => void loadApprovals()}
          disabled={loading}
          className="self-start rounded-full sm:self-auto"
        >
          <RefreshCw
            data-icon="inline-start"
            className={cn(loading && "animate-spin")}
          />
          Refresh
        </Button>
      </header>

      <section className="overflow-hidden rounded-xl border border-[#E7ECF2] bg-white shadow-sm">
        <div className="border-b border-[#E7ECF2] p-4 sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_190px_210px_165px_165px]">
            <label className="relative block">
              <span className="sr-only">Search by corporate name</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search corporate name"
                className="h-10 rounded-full border-slate-200 pl-9"
              />
            </label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as StatusFilter)}
            >
              <SelectTrigger className="h-10 w-full rounded-full border-slate-200">
                <SelectValue placeholder="Approval status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="ALL">All statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select
              value={workflow}
              onValueChange={(value) => setWorkflow(value as WorkflowFilter)}
            >
              <SelectTrigger className="h-10 w-full rounded-full border-slate-200">
                <SelectValue placeholder="Workflow stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="ALL">All workflow stages</SelectItem>
                  <SelectItem value="PENDING_MAKER_REVIEW">
                    Maker Review
                  </SelectItem>
                  <SelectItem value="PENDING_CHECKER_REVIEW">
                    Checker Review
                  </SelectItem>
                  <SelectItem value="APPROVED">
                    Approved
                  </SelectItem>
                  <SelectItem value="REJECTED">
                    Rejected
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <label className="relative block">
              <span className="sr-only">Requested from</span>
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="date"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
                max={toDate || undefined}
                className="h-10 rounded-full border-slate-200 pl-9 text-xs"
              />
            </label>
            <label className="relative block">
              <span className="sr-only">Requested to</span>
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="date"
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
                min={fromDate || undefined}
                className="h-10 rounded-full border-slate-200 pl-9 text-xs"
              />
            </label>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Corporate name</TableHead>
              <TableHead>Request ID</TableHead>
              <TableHead>Approval type</TableHead>
              <TableHead>Workflow stage</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className="sr-only">View</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableLoading />
            ) : error ? (
              <TableRow className="hover:bg-white">
                <TableCell colSpan={7} className="h-64 text-center">
                  <div className="mx-auto flex max-w-md flex-col items-center gap-3">
                    <CircleAlert className="size-8 text-rose-500" />
                    <p className="font-medium text-slate-900">
                      Unable to load approvals
                    </p>
                    <p className="whitespace-normal text-sm text-slate-500">
                      {error}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => void loadApprovals()}
                    >
                      Try again
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : approvals.length === 0 ? (
              <TableRow className="hover:bg-white">
                <TableCell colSpan={7} className="h-64 text-center">
                  <div className="mx-auto flex max-w-md flex-col items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-full bg-[#EDF2F8] text-[#193F7F]">
                      <FileCheck2 className="size-6" />
                    </div>
                    <p className="font-medium text-slate-900">
                      No approval requests found
                    </p>
                    <p className="whitespace-normal text-sm text-slate-500">
                      Try changing the filters or search term to see more
                      requests.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              approvals.map((approval) => (
                <TableRow
                  key={approval.approvalRequestId}
                  tabIndex={0}
                  role="button"
                  onClick={() => setSelectedId(approval.approvalRequestId)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedId(approval.approvalRequestId);
                    }
                  }}
                  className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#193F7F]"
                >
                  <TableCell className="font-medium">
                    {approval.corporateName || "—"}
                  </TableCell>
                  <TableCell className="max-w-44 truncate font-mono text-xs text-slate-500">
                    {approval.approvalRequestId}
                  </TableCell>
                  <TableCell>{humanize(approval.approvalType)}</TableCell>
                  <TableCell>
                    {workflowLabels[approval.workflowState] ??
                      humanize(approval.workflowState)}
                  </TableCell>
                  <TableCell className="text-slate-500">
                    {formatDate(approval.requestedAt)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={approval.approvalStatus} />
                  </TableCell>
                  <TableCell className="text-right text-slate-400">
                    <ChevronRight className="ml-auto size-4" />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between border-t border-[#E7ECF2] px-4 py-3 sm:px-6">
          <p className="text-sm text-slate-500">Page {currentPage}</p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading || cursorHistory.length === 0}
              onClick={() => {
                const history = [...cursorHistory];
                setCursor(history.pop());
                setCursorHistory(history);
              }}
            >
              <ArrowLeft data-icon="inline-start" /> Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading || !nextCursor}
              onClick={() => {
                setCursorHistory((history) => [...history, cursor]);
                setCursor(nextCursor ?? undefined);
              }}
            >
              Next <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </section>

      <Dialog open={Boolean(selectedId)} onOpenChange={closeDetails}>
        <DialogContent className="max-h-[92dvh] overflow-y-auto p-0 sm:max-w-4xl">
          <DialogHeader className="sticky top-0 border-b bg-white px-6 py-5 sm:px-8">
            <div className="flex items-start justify-between gap-4 pr-8">
              <div>
                <DialogTitle>Approval request</DialogTitle>
                <DialogDescription className="mt-1">
                  Review the submitted data and the complete action history.
                </DialogDescription>
              </div>
              {details && <StatusBadge status={details.approvalStatus} />}
            </div>
          </DialogHeader>

          {detailsLoading ? (
            <div className="flex flex-col gap-4 px-6 py-8 sm:px-8">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-52 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : detailsError || !details ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 px-6 text-center">
              <CircleAlert className="size-8 text-rose-500" />
              <p className="font-medium">
                {detailsError || "Approval details are unavailable."}
              </p>
              {selectedId && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void loadDetails(selectedId)}
                >
                  Try again
                </Button>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-7 px-6 py-7 sm:px-8">
              <div className="grid gap-4 rounded-xl bg-slate-50 p-5 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-xs text-slate-500">Corporate</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {details.corporateName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Workflow</p>
                  <p className="mt-1 text-sm font-medium">
                    {workflowLabels[details.workflowState] ??
                      humanize(details.workflowState)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Requested</p>
                  <p className="mt-1 text-sm font-medium">
                    {formatDate(details.requestedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Initiator</p>
                  <p className="mt-1 text-sm font-medium">
                    {details.initiator?.name || "—"}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {details.initiator?.email}
                  </p>
                </div>
              </div>

              <section>
                <h3 className="mb-3 text-sm font-semibold text-slate-900">
                  Submitted changes
                </h3>
                <DataComparison approval={details} />
              </section>

              <section>
                <h3 className="mb-3 text-sm font-semibold text-slate-900">
                  Action history
                </h3>
                {details.actionHistory?.length ? (
                  <ol className="flex flex-col gap-4 border-l border-slate-200 pl-5">
                    {details.actionHistory.map((item, index) => (
                      <li
                        key={`${item.createdAt}-${index}`}
                        className="relative"
                      >
                        <span className="absolute -left-[25px] top-1.5 size-2 rounded-full bg-[#193F7F] ring-4 ring-white" />
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <p className="text-sm font-medium text-slate-900">
                            {item.actorName}{" "}
                            <span className="font-normal text-slate-500">
                              · {item.actorRole}
                            </span>
                          </p>
                          <time className="text-xs text-slate-400">
                            {formatDate(item.createdAt)}
                          </time>
                        </div>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#193F7F]">
                          {humanize(item.action)}
                        </p>
                        {item.comment && (
                          <p className="mt-1 text-sm text-slate-600">
                            {item.comment}
                          </p>
                        )}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div className="flex items-center gap-2 rounded-lg border border-dashed p-4 text-sm text-slate-500">
                    <Clock3 className="size-4" /> No actions have been recorded
                    yet.
                  </div>
                )}
              </section>

              {actions.length > 0 && (
                <section className="border-t pt-6">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Record decision
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Select an action, then add an audit comment.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {actions.map((action) => {
                      const positive =
                        action === "APPROVE" || action === "RECOMMEND_APPROVAL";
                      return (
                        <Button
                          key={action}
                          type="button"
                          variant={
                            pendingAction === action ? "default" : "outline"
                          }
                          onClick={() => setPendingAction(action)}
                          className={cn(
                            "rounded-full",
                            pendingAction === action &&
                              positive &&
                              "bg-[#193F7F] hover:bg-[#132A55]",
                            pendingAction === action &&
                              !positive &&
                              "bg-rose-600 hover:bg-rose-700",
                          )}
                        >
                          {positive ? (
                            <CheckCircle2 data-icon="inline-start" />
                          ) : (
                            <XCircle data-icon="inline-start" />
                          )}
                          {actionCopy[action].label}
                        </Button>
                      );
                    })}
                  </div>
                  {pendingAction && (
                    <div className="mt-4 flex flex-col gap-2">
                      <label
                        htmlFor="approval-comment"
                        className="text-sm font-medium text-slate-700"
                      >
                        Comment
                      </label>
                      <Textarea
                        id="approval-comment"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        placeholder="Explain the reason for this decision"
                        rows={4}
                        maxLength={1000}
                        aria-describedby="approval-comment-count"
                      />
                      <p
                        id="approval-comment-count"
                        className="text-right text-xs text-slate-400"
                      >
                        {comment.length}/1000
                      </p>
                    </div>
                  )}
                </section>
              )}
            </div>
          )}

          <DialogFooter className="sticky bottom-0 border-t bg-white px-6 py-4 sm:px-8">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Close
              </Button>
            </DialogClose>
            {pendingAction && details && (
              <Button
                type="button"
                onClick={() => void submitAction()}
                disabled={submitting || !comment.trim()}
                isLoading={submitting}
                className={cn(
                  pendingAction === "REJECT" ||
                    pendingAction === "RECOMMEND_REJECTION"
                    ? "bg-rose-600 hover:bg-rose-700"
                    : "bg-[#193F7F] hover:bg-[#132A55]",
                )}
              >
                {actionCopy[pendingAction].label}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
