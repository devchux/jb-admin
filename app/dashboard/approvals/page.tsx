import type { Metadata } from "next";
import ApprovalWorkspace from "@/components/tables/approvals/ApprovalWorkspace";

export const metadata: Metadata = {
  title: "Approvals",
  description: "Review and manage pending administrative approvals.",
};

export default function ApprovalsPage() {
  return <ApprovalWorkspace />;
}
