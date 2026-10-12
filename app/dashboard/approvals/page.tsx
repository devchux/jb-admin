import type { Metadata } from "next";
import { CircleCheckBig, Clock3 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Approvals",
  description: "Review and manage pending administrative approvals.",
};

export default function ApprovalsPage() {
  return (
    <div className="px-2 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-medium text-slate-500">Operations</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-950">
          Approvals
        </h1>
      </div>

      <Card className="mx-auto max-w-2xl border-[#E7ECF2] shadow-sm">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-[#EDF2F8] text-[#193F7F]">
            <CircleCheckBig className="size-6" />
          </div>
          <CardTitle>Approvals workspace</CardTitle>
          <CardDescription className="max-w-md">
            This page is ready for the approval queues and workflows that will
            be added next.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center gap-2 text-sm text-slate-500">
          <Clock3 className="size-4" />
          <span>No approval requests are available yet.</span>
        </CardContent>
      </Card>
    </div>
  );
}
