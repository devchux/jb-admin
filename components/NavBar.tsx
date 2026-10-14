"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  ChevronDown,
  CircleCheckBig,
  CreditCard,
  FileBarChart,
  HelpCircle,
  Home,
  Megaphone,
  ShoppingBag,
  UserRound,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePermissions } from "@/hooks/use-permissions";
import type { Permission } from "@/lib/constants";

const retailLinks: Array<{
  label: string;
  href: string;
  icon: typeof Home;
  permissions?: readonly Permission[];
}> = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Customer and Channels Operations", href: "/dashboard/users", icon: Users, permissions: ["user:read", "audit:read"] },
  { label: "Bank Staff and Access", href: "/dashboard/users/admins", icon: UserRound, permissions: ["user:read", "role:read", "permission:read"] },
  { label: "Transactions", href: "/dashboard/transactions", icon: CreditCard, permissions: ["transaction:read"] },
  { label: "Help and Support", href: "/dashboard/help", icon: HelpCircle, permissions: ["ticket:read"] },
  { label: "Broadcast Notifications", href: "/dashboard/notifications", icon: Megaphone, permissions: ["notification:read", "image:read"] },
  { label: "Reports", href: "/dashboard/reports", icon: FileBarChart, permissions: ["report:read"] },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const { hasAnyPermission } = usePermissions();

  const isActive = (href: string) => pathname === href;

  return (
    <Sidebar collapsible="offcanvas" className="border-r-0">
      <SidebarHeader className="px-5 pb-4 pt-5">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
        >
          <Image width={44} height={48} src="/images/logo.png" alt="Jaiz Bank" priority />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#193F7F]">Jaiz Bank</p>
            <p className="truncate text-xs text-muted-foreground">Admin Portal</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 pb-4">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="h-11 rounded-xl px-3 font-semibold text-[#193F7F] hover:bg-[#EDF2F8] hover:text-[#193F7F] data-[state=open]:bg-[#EDF2F8] data-[state=open]:text-[#193F7F]"
                    >
                      <ShoppingBag />
                      <span>Retail</span>
                      <ChevronDown className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="mx-4 mt-1 gap-1 border-[#D9E2EE] py-1 pl-3 pr-0">
                      {retailLinks
                        .filter(({ permissions }) => !permissions || hasAnyPermission(permissions))
                        .map(({ label, href, icon: Icon }) => (
                        <SidebarMenuSubItem key={href}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isActive(href)}
                            className="h-auto min-h-9 rounded-lg py-2 text-xs text-slate-600 hover:bg-[#EDF2F8] hover:text-[#193F7F] data-[active=true]:bg-[#193F7F] data-[active=true]:font-medium data-[active=true]:text-white"
                          >
                            <Link href={href} onClick={() => setOpenMobile(false)}>
                              <Icon />
                              <span>{label}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {hasAnyPermission(["corporate-approval:read"]) && <SidebarMenuItem>
                <SidebarMenuButton
                  disabled
                  size="lg"
                  className="h-11 rounded-xl px-3 text-slate-500 disabled:opacity-100"
                >
                  <Building2 />
                  <span>Corporate</span>
                  <Badge
                    variant="secondary"
                    className="ml-auto border-0 bg-[#F0F2F5] px-2 text-[10px] font-medium text-slate-500"
                  >
                    Coming soon
                  </Badge>
                </SidebarMenuButton>
              </SidebarMenuItem>}

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  size="lg"
                  isActive={isActive("/dashboard/approvals")}
                  className="h-11 rounded-xl px-3 text-slate-600 hover:bg-[#EDF2F8] hover:text-[#193F7F] data-[active=true]:bg-[#193F7F] data-[active=true]:font-medium data-[active=true]:text-white"
                >
                  <Link
                    href="/dashboard/approvals"
                    onClick={() => setOpenMobile(false)}
                  >
                    <CircleCheckBig />
                    <span>Approvals</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
