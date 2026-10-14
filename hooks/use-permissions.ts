"use client";

import { useCallback, useMemo } from "react";

import type { Permission } from "@/lib/constants";
import { useStore } from "@/store";

export type { Permission } from "@/lib/constants";

/**
 * Provides permission checks for the currently authenticated user.
 *
 * Permission names are compared exactly with the values returned by the API.
 * An empty `hasAllPermissions` request is allowed, while an empty
 * `hasAnyPermission` request is denied.
 */
export function usePermissions() {
  const permissions = useStore((state) => state.user?.permissions);

  const permissionSet = useMemo(
    () => new Set(permissions ?? []),
    [permissions],
  );

  const hasPermission = useCallback(
    (permission: Permission) => permissionSet.has(permission),
    [permissionSet],
  );

  const hasAnyPermission = useCallback(
    (requiredPermissions: readonly Permission[]) =>
      requiredPermissions.some((permission) => permissionSet.has(permission)),
    [permissionSet],
  );

  const hasAllPermissions = useCallback(
    (requiredPermissions: readonly Permission[]) =>
      requiredPermissions.every((permission) => permissionSet.has(permission)),
    [permissionSet],
  );

  return {
    permissions: permissions ?? [],
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  } as const;
}
