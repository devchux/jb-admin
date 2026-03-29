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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import SuccessModal from "@/components/modals/Success";
import { useForm } from "react-hook-form";
import { Permission, Role, User } from "@/types/common";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { roleService } from "@/services/role";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { userService } from "@/services/user";

interface CreateUserProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  user?: User | null;
}

const defaultValues = {
  email: "",
  phoneNumber: "",
  firstName: "",
  lastName: "",
  roleId: "",
  permissionNames: [],
};

const schema = z.object({
  email: z.email("Invalid email address"),
  phoneNumber: z.string().min(11, "Phone number must be at least 11 digits"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  roleId: z.string().min(1, "Role is required"),
  permissionNames: z.array(z.string()).min(1, "Permissions are required"),
});

const CreateUser = ({ open, onOpenChange, user }: CreateUserProps) => {
  const form = useForm({ defaultValues, resolver: zodResolver(schema) });
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const togglePermission = (key: string) => {
    const currentPermissions = form.getValues("permissionNames");
    if (currentPermissions.includes(key)) {
      form.setValue(
        "permissionNames",
        currentPermissions.filter((p) => p !== key),
      );
    } else {
      form.setValue("permissionNames", [...currentPermissions, key]);
    }
  };

  const onRoleChange = (value: string) => {
    form.setValue("roleId", value);
    const role = roles.find((role) => role.id === value);
    if (role) {
      form.setValue("permissionNames", role.permissions);
    }
  };

  const getRoles = async () => {
    try {
      const response = await roleService.getRoles();
      setRoles(response.data);
    } catch {
      toast.error("Failed to fetch roles");
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
      if (user) {
        await userService.updateUser(user.id, data);
      } else {
        await userService.createUser(data);
      }
      setShowSuccess(true);
      form.reset();
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      toast.error(error.response?.data?.error || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRoles();
    getPermissions();
  }, []);

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        roleId: user.role.id,
        permissionNames: user.permissions,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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
                Create New User
              </DialogTitle>
              <DialogDescription className="text-sm text-[#4E7397]">
                Fill details to create a new user or the admin portal.
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
                First Name
              </Label>
              <Input
                placeholder="First Name"
                className="h-14 rounded-xl border-[#E2E8F0] text-[#25272E] px-4 text-[15px] font-normal placeholder:text-[#25272E] focus-visible:ring-1 focus-visible:ring-[#193F7F] focus-visible:border-[#193F7F]"
                {...form.register("firstName", { required: true })}
                error={form.formState.errors.firstName?.message}
              />
            </div>

            <div>
              <Label className="text-[#4E7397] font-medium text-[13px] mb-2 block">
                Last Name
              </Label>
              <Input
                placeholder="Last Name"
                className="h-14 rounded-xl border-[#E2E8F0] text-[#25272E] px-4 text-[15px] font-normal placeholder:text-[#25272E] focus-visible:ring-1 focus-visible:ring-[#193F7F] focus-visible:border-[#193F7F]"
                {...form.register("lastName", { required: true })}
                error={form.formState.errors.lastName?.message}
              />
            </div>

            <div>
              <Label className="text-[#4E7397] font-medium text-[13px] mb-2 block">
                Email
              </Label>
              <Input
                placeholder="Email"
                className="h-14 rounded-xl border-[#E2E8F0] text-[#25272E] px-4 text-[15px] font-normal placeholder:text-[#25272E] focus-visible:ring-1 focus-visible:ring-[#193F7F] focus-visible:border-[#193F7F]"
                {...form.register("email", { required: true })}
                error={form.formState.errors.email?.message}
              />
            </div>

            <div>
              <Label className="text-[#4E7397] font-medium text-[13px] mb-2 block">
                Phone Number
              </Label>
              <Input
                placeholder="Phone Number"
                className="h-14 rounded-xl border-[#E2E8F0] text-[#25272E] px-4 text-[15px] font-normal placeholder:text-[#25272E] focus-visible:ring-1 focus-visible:ring-[#193F7F] focus-visible:border-[#193F7F]"
                {...form.register("phoneNumber", { required: true })}
                error={form.formState.errors.phoneNumber?.message}
              />
            </div>

            <div>
              <Label className="text-[#4E7397] font-medium text-[13px] mb-2 block">
                Assign Role
              </Label>
              <Select onValueChange={onRoleChange}>
                <SelectTrigger className="h-14! w-full rounded-xl border-[#E7ECF2] text-[#25272E] px-4 font-normal focus:ring-1 focus:ring-[#193F7F]">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-[#E2E8F0]">
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {form.formState.errors.roleId?.message && (
                <p className="text-xs text-destructive mt-2">
                  {form.formState.errors.roleId?.message}
                </p>
              )}
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

      <SuccessModal
        open={showSuccess}
        onOpenChange={setShowSuccess}
        title={user ? "User updated successfully" : "User created successfully"}
        description={
          user
            ? "The user details have been updated."
            : "A new user has been added to the system."
        }
        onDone={() => {
          setShowSuccess(false);
          onOpenChange?.(false);
        }}
      />
    </Dialog>
  );
};

export default CreateUser;
