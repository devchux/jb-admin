"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff, KeyRound, Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { adminService } from "@/services/admin";

const usernameSchema = z.object({
  username: z.string().min(1, "Username is required"),
});

const resetSchema = z
  .object({
    otp: z.string().min(1, "OTP is required"),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type UsernameForm = z.infer<typeof usernameSchema>;
type ResetForm = z.infer<typeof resetSchema>;

type ForgotPasswordFormProps = {
  onBackToLogin?: () => void;
};

const ForgotPasswordForm = ({ onBackToLogin }: ForgotPasswordFormProps) => {
  const router = useRouter();
  const [step, setStep] = useState<"username" | "reset">("username");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const usernameForm = useForm<UsernameForm>({
    defaultValues: { username: "" },
    resolver: zodResolver(usernameSchema),
  });
  const resetForm = useForm<ResetForm>({
    defaultValues: {
      otp: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(resetSchema),
  });

  const handleForgotPassword = async (data: UsernameForm) => {
    try {
      setLoading(true);
      await adminService.forgotPassword({ username: data.username });
      setUsername(data.username);
      setStep("reset");
      toast.success("OTP sent. Enter it below to reset your password.");
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      toast.error(error.response?.data?.error || "Failed to start reset");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (data: ResetForm) => {
    try {
      setLoading(true);
      await adminService.resetPassword({
        userId: username,
        password: data.password,
        otp: data.otp,
      });
      toast.success("Password reset successful. Please log in.");
      resetForm.reset();
      usernameForm.reset();
      if (onBackToLogin) onBackToLogin();
      else router.push("/");
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      toast.error(error.response?.data?.error || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === "reset") {
      setStep("username");
      resetForm.reset();
      return;
    }

    if (onBackToLogin) onBackToLogin();
    else router.push("/");
  };

  return (
    <div className="w-full max-w-[440px] bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#E2E8F0] overflow-hidden flex flex-col items-center">
      <div className="w-full h-2 bg-[#193F7F]"></div>

      <div className="p-10 w-full flex flex-col items-center">
        <div className="mb-4 mt-2 w-full flex justify-center">
          <Image
            src="/images/logo.png"
            alt="Jaiz Bank Logo"
            width={80}
            height={50}
            className="object-contain"
            priority
          />
        </div>

        <div className="text-center mb-8 space-y-2 w-full">
          <h1 className="text-[26px] font-bold text-[#0B1527] tracking-tight">
            {step === "username" ? "Forgot Password" : "Reset Password"}
          </h1>
          <p className="text-[14px] text-[#4E7397]">
            {step === "username"
              ? "Enter your username to receive a reset OTP."
              : `Enter the OTP sent for ${username} and choose a new password.`}
          </p>
        </div>

        {step === "username" ? (
          <form
            onSubmit={usernameForm.handleSubmit(handleForgotPassword)}
            className="w-full space-y-6"
          >
            <div className="space-y-2.5">
              <Label
                htmlFor="reset-username"
                className="text-[#4E7397] font-medium text-[13px] ml-1"
              >
                Username
              </Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#A0AEC0] group-focus-within:text-[#193F7F] transition-colors" />
                <Input
                  id="reset-username"
                  type="text"
                  placeholder="Enter your username"
                  className="pl-12 h-14 rounded-xl border-[#E2E8F0] text-[#1A202C] text-[15px] font-medium placeholder:text-[#A0AEC0] placeholder:font-normal focus-visible:ring-1 focus-visible:ring-[#193F7F] focus-visible:border-[#193F7F] transition-all bg-white"
                  {...usernameForm.register("username")}
                />
              </div>
              {usernameForm.formState.errors.username && (
                <p className="text-[#E11D48] text-xs ml-1 font-medium mt-1">
                  {usernameForm.formState.errors.username.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              isLoading={loading}
              className="w-full h-14 rounded-xl bg-[#193F7F] hover:bg-[#132A55] text-white font-semibold text-[15px]"
            >
              Continue
            </Button>
          </form>
        ) : (
          <form
            onSubmit={resetForm.handleSubmit(handleResetPassword)}
            className="w-full space-y-6"
          >
            <div className="space-y-2.5">
              <Label
                htmlFor="otp"
                className="text-[#4E7397] font-medium text-[13px] ml-1"
              >
                OTP
              </Label>
              <div className="relative group">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#A0AEC0] group-focus-within:text-[#193F7F] transition-colors" />
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter OTP"
                  className="pl-12 h-14 rounded-xl border-[#E2E8F0] text-[#1A202C] text-[15px] font-medium placeholder:text-[#A0AEC0] placeholder:font-normal focus-visible:ring-1 focus-visible:ring-[#193F7F] focus-visible:border-[#193F7F] transition-all bg-white"
                  {...resetForm.register("otp")}
                />
              </div>
              {resetForm.formState.errors.otp && (
                <p className="text-[#E11D48] text-xs ml-1 font-medium mt-1">
                  {resetForm.formState.errors.otp.message}
                </p>
              )}
            </div>

            <PasswordField
              id="new-password"
              label="New Password"
              placeholder="Enter new password"
              visible={showPassword}
              onToggle={() => setShowPassword((value) => !value)}
              registration={resetForm.register("password")}
              error={resetForm.formState.errors.password?.message}
            />

            <PasswordField
              id="confirm-password"
              label="Confirm Password"
              placeholder="Confirm new password"
              visible={showConfirmPassword}
              onToggle={() => setShowConfirmPassword((value) => !value)}
              registration={resetForm.register("confirmPassword")}
              error={resetForm.formState.errors.confirmPassword?.message}
            />

            <Button
              type="submit"
              isLoading={loading}
              className="w-full h-14 rounded-xl bg-[#193F7F] hover:bg-[#132A55] text-white font-semibold text-[15px]"
            >
              Reset Password
            </Button>
          </form>
        )}

        <button
          type="button"
          onClick={handleBack}
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#193F7F] hover:text-[#132A55]"
        >
          <ArrowLeft className="h-4 w-4" />
          {step === "username" ? "Back to login" : "Use another username"}
        </button>
      </div>
    </div>
  );
};

const PasswordField = ({
  id,
  label,
  placeholder,
  visible,
  onToggle,
  registration,
  error,
}: {
  id: string;
  label: string;
  placeholder: string;
  visible: boolean;
  onToggle: () => void;
  registration: ReturnType<typeof useForm<ResetForm>>["register"] extends (
    name: infer Name,
  ) => infer Result
    ? Result
    : never;
  error?: string;
}) => (
  <div className="space-y-2.5">
    <Label
      htmlFor={id}
      className="text-[#4E7397] font-medium text-[13px] ml-1"
    >
      {label}
    </Label>
    <div className="relative group">
      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#A0AEC0] group-focus-within:text-[#193F7F] transition-colors" />
      <Input
        id={id}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        className="pl-12 pr-12 h-14 rounded-xl border-[#E2E8F0] text-[#1A202C] text-[15px] font-medium placeholder:text-[#A0AEC0] placeholder:font-normal focus-visible:ring-1 focus-visible:ring-[#193F7F] focus-visible:border-[#193F7F] transition-all bg-white"
        {...registration}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A0AEC0] hover:text-[#193F7F] transition-colors focus:outline-none"
      >
        {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
    {error && (
      <p className="text-[#E11D48] text-xs ml-1 font-medium mt-1">{error}</p>
    )}
  </div>
);

export default ForgotPasswordForm;
