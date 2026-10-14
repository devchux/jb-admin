"use client";

import type { ReactNode } from "react";

import { usePermissions } from "@/hooks/use-permissions";
import type { Permission } from "@/lib/constants";

type PermissionGuardProps = {
  children: ReactNode;
  permissions: readonly Permission[];
  requireAll?: boolean;
  fallback?: ReactNode;
};

export default function PermissionGuard({
  children,
  permissions,
  requireAll = false,
  fallback,
}: PermissionGuardProps) {
  const { hasAllPermissions, hasAnyPermission } = usePermissions();
  const allowed = requireAll
    ? hasAllPermissions(permissions)
    : hasAnyPermission(permissions);

  if (allowed) return children;

  return (
    fallback ?? (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-lg font-semibold text-slate-900">Access denied</h1>
        <p className="mt-2 text-sm text-slate-500">
          You do not have permission to view this section.
        </p>
      </div>
    )
  );
}
