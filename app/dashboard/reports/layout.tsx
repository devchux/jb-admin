import type { ReactNode } from "react";

import PermissionGuard from "@/components/PermissionGuard";

export default function ReportsLayout({ children }: { children: ReactNode }) {
  return (
    <PermissionGuard permissions={["report:read"]}>
      {children}
    </PermissionGuard>
  );
}
