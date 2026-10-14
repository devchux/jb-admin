import type { Metadata } from "next";
import ApprovalWorkspace from "@/components/tables/approvals/ApprovalWorkspace";
import PermissionGuard from "@/components/PermissionGuard";

export const metadata: Metadata = {
  title: "Approvals",
  description: "Review and manage pending administrative approvals.",
};

export default function ApprovalsPage() {
  return (
    <PermissionGuard permissions={["corporate-approval:read"]}>
      <ApprovalWorkspace />
    </PermissionGuard>
  );
}
