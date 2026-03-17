"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { Permission, Role } from "@/types/common";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { roleService } from "@/services/role";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Textarea } from "../ui/textarea";

interface CreateRoleProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  role?: Role | null;
}

const defaultValues = {
  name: "",
  description: "",
  permissionNames: [],
};

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  permissionNames: z.array(z.string()),
});

const CreateRole = ({ open, onOpenChange, role }: CreateRoleProps) => {
  const form = useForm({ defaultValues, resolver: zodResolver(schema) });
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);

  const togglePermission = (key: string) => {
    const currentPermissions = form.getValues("permissionNames");
    if (currentPermissions.includes(key)) {
      form.setValue(
        "permissionNames",
        currentPermissions.filter((p) => p !== key),
      );
    } else {
      form.setValue("permissionNames", [...currentPermissions, key], {
        shouldDirty: true,
      });
    }
  };

  const getPermissions = async () => {
    try {
      const response = await roleService.getPermissions();
      setPermissions(response.data);
    } catch {
      toast.error("Failed to fetch permissions");
    }
  };

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      setLoading(true);
      if (role) {
        await roleService.updateRole(role.id, data);
        toast.success("Role updated successfully");
      } else {
        await roleService.createRole(data);
        toast.success("Role created successfully");
      }
      onOpenChange?.(false);
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      toast.error(error.response?.data?.error || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPermissions();
  }, []);

  useEffect(() => {
    if (role) {
      form.reset({
        name: role.name,
        description: role.description,
        permissionNames: role.permissions,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-125 p-0 overflow-hidden bg-white gap-0 rounded-3xl max-h-[90vh] overflow-y-auto"
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <DialogTitle className="text-2xl font-semibold text-[#0B1527] mb-2">
                {role ? "Edit Role" : "Create New Role"}
              </DialogTitle>
              <DialogDescription className="text-sm text-[#4E7397]">
                {role
                  ? "Manage permissions for the selected role."
                  : "Fill details to create a new role"}
              </DialogDescription>
            </div>
            <DialogClose asChild>
              <button className="h-11 w-11 rounded-2xl bg-[#EEF2F6] text-[#0F2851] flex items-center justify-center hover:bg-[#E2E8F0] transition-colors shrink-0">
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </DialogClose>
          </div>

          <div className="space-y-5">
            <div>
              <Label className="text-[#4E7397] font-medium text-[13px] mb-2 block">
                Role Name
              </Label>
              <Input
                placeholder="Role Name"
                className="h-14 rounded-xl border-[#E2E8F0] text-[#25272E] px-4 text-[15px] font-normal placeholder:text-[#25272E] focus-visible:ring-1 focus-visible:ring-[#193F7F] focus-visible:border-[#193F7F]"
                {...form.register("name", { required: true })}
                error={form.formState.errors.name?.message}
              />
            </div>

            <div>
              <Label className="text-[#4E7397] font-medium text-[13px] mb-2 block">
                Role Description
              </Label>
              <Textarea
                placeholder="Enter description"
                className="min-h-30 rounded-xl border-[#E2E8F0] text-[#1A202C] px-4 py-3 text-[15px] font-normal placeholder:text-[#1A202C]/50 focus-visible:ring-1 focus-visible:ring-[#193F7F] focus-visible:border-[#193F7F]"
                {...form.register("description", { required: true })}
                error={form.formState.errors.description?.message}
              />
            </div>
          </div>

          <div className="h-px bg-[#EEF2F6] my-8" />

          <div>
            <h3 className="text-[15px] font-semibold text-[#111827] mb-5">
              Permissions
            </h3>
            <div className="space-y-4">
              {permissions.map((permission) => (
                <div
                  key={permission.id}
                  className="flex items-center space-x-3"
                >
                  <Checkbox
                    id={permission.id}
                    checked={form
                      .watch("permissionNames")
                      .includes(permission.name)}
                    onCheckedChange={() => togglePermission(permission.name)}
                    className="rounded bg-white data-[state=checked]:bg-[#193F7F] data-[state=checked]:border-[#193F7F] border-[#C3D0DF] size-4.5"
                  />
                  <Label
                    htmlFor={permission.id}
                    className="text-[14px] text-[#374151] font-normal cursor-pointer leading-none"
                  >
                    {permission.description}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex justify-end gap-3">
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                className="rounded-full px-8 py-5.5 bg-[#EEF2F6] text-[#0A1629] hover:bg-[#E2E8F0] shadow-none font-medium text-[15px]"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              isLoading={loading}
              className="rounded-full px-8 py-5.5 bg-[#193F7F] text-white hover:bg-[#132A55] shadow-none font-medium text-[15px]"
            >
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRole;
