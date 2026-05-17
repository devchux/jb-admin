"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userService } from "@/services/user";
import { useStore } from "@/store";

const schema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(1, "New password is required"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .superRefine((data, ctx) => {
    if (data.oldPassword === data.newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["newPassword"],
        message: "New password must be different from current password",
      });
    }

    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });

type ChangePasswordForm = z.infer<typeof schema>;

type ChangePasswordProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const passwordFields: Array<{
  name: keyof ChangePasswordForm;
  label: string;
  placeholder: string;
}> = [
  {
    name: "oldPassword",
    label: "Current Password",
    placeholder: "Enter current password",
  },
  {
    name: "newPassword",
    label: "New Password",
    placeholder: "Enter new password",
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    placeholder: "Confirm new password",
  },
];

const ChangePassword = ({ open, onOpenChange }: ChangePasswordProps) => {
  const router = useRouter();
  const reset = useStore((state) => state.reset);
  const [loading, setLoading] = useState(false);
  const [visibleFields, setVisibleFields] = useState<
    Partial<Record<keyof ChangePasswordForm, boolean>>
  >({});

  const form = useForm<ChangePasswordForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (data: ChangePasswordForm) => {
    try {
      setLoading(true);
      await userService.changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });

      toast.success("Password changed. Please log in again.");
      onOpenChange?.(false);
      form.reset();
      reset();
      router.push("/");
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      toast.error(error.response?.data?.error || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = (field: keyof ChangePasswordForm) => {
    setVisibleFields((current) => ({
      ...current,
      [field]: !current[field],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md overflow-hidden bg-white gap-0 rounded-3xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-[22px] font-semibold text-[#0B1527] mb-2 leading-none">
          Change Password
        </DialogTitle>
        <DialogDescription className="text-[14px] text-[#4E7397] leading-5 mb-6">
          Update your password. You will be logged out after a successful
          change.
        </DialogDescription>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          {passwordFields.map((field) => {
            const isVisible = Boolean(visibleFields[field.name]);
            const error = form.formState.errors[field.name];

            return (
              <div key={field.name} className="space-y-2">
                <Label className="text-[#4E7397] font-medium text-[13px] ml-1">
                  {field.label}
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#A0AEC0] group-focus-within:text-[#193F7F] transition-colors" />
                  <Input
                    type={isVisible ? "text" : "password"}
                    placeholder={field.placeholder}
                    className="pl-12 pr-12 h-13 rounded-xl border-[#E2E8F0] text-[#1A202C] text-[15px] font-medium placeholder:text-[#A0AEC0] placeholder:font-normal focus-visible:ring-1 focus-visible:ring-[#193F7F] focus-visible:border-[#193F7F] transition-all bg-white"
                    {...form.register(field.name)}
                  />
                  <button
                    type="button"
                    onClick={() => toggleVisibility(field.name)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A0AEC0] hover:text-[#193F7F] transition-colors focus:outline-none"
                  >
                    {isVisible ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {error && (
                  <p className="text-[#E11D48] text-xs ml-1 font-medium">
                    {error.message}
                  </p>
                )}
              </div>
            );
          })}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange?.(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={loading}
              className="bg-[#193F7F] hover:bg-[#132A55] text-white"
            >
              Change Password
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePassword;
