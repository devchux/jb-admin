"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { adminService } from "@/services/admin";
import { useStore } from "@/store";

const defaultValues = {
  username: "",
  password: "",
};

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm({ defaultValues, resolver: zodResolver(schema) });
  const router = useRouter();
  const { setToken, setUser } = useStore();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: z.infer<typeof schema>) => {
    try {
      setLoading(true);
      const response = await adminService.loginAdminUser(data);
      setToken(
        response.data.data.access_token,
        response.data.data.refresh_token,
      );
      setUser(response.data.data.user);
      router.push("/dashboard");
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      toast.error(error.response?.data?.error || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#E2E8F0] overflow-hidden flex flex-col items-center">
      {/* Top Banner / Accent */}
      <div className="w-full h-2 bg-[#193F7F]"></div>

      <div className="p-10 w-full flex flex-col items-center">
        {/* Logo Section */}
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
            Welcome Back
          </h1>
          <p className="text-[14px] text-[#4E7397]">
            Please enter your credentials to access the admin portal.
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="w-full space-y-6"
        >
          {/* Username Field */}
          <div className="space-y-2.5">
            <Label
              htmlFor="username"
              className="text-[#4E7397] font-medium text-[13px] ml-1"
            >
              Username
            </Label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#A0AEC0] group-focus-within:text-[#193F7F] transition-colors" />
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                className="pl-12 h-14 rounded-xl border-[#E2E8F0] text-[#1A202C] text-[15px] font-medium placeholder:text-[#A0AEC0] placeholder:font-normal focus-visible:ring-1 focus-visible:ring-[#193F7F] focus-visible:border-[#193F7F] transition-all bg-white"
                {...form.register("username")}
              />
            </div>
            {form.formState.errors.username && (
              <p className="text-[#E11D48] text-xs ml-1 font-medium mt-1">
                {form.formState.errors.username.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2.5">
            <Label
              htmlFor="password"
              className="text-[#4E7397] font-medium text-[13px] ml-1"
            >
              Password
            </Label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#A0AEC0] group-focus-within:text-[#193F7F] transition-colors" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pl-12 pr-12 h-14 rounded-xl border-[#E2E8F0] text-[#1A202C] text-[15px] font-medium placeholder:text-[#A0AEC0] placeholder:font-normal focus-visible:ring-1 focus-visible:ring-[#193F7F] focus-visible:border-[#193F7F] transition-all bg-white"
                {...form.register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A0AEC0] hover:text-[#193F7F] transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className="text-[#E11D48] text-xs ml-1 font-medium mt-1">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              isLoading={loading}
              className="w-full h-14 rounded-xl bg-[#193F7F] hover:bg-[#132A55] text-white font-semibold text-[15px] shadow-[0_4px_14px_0_rgba(25,63,127,0.39)] transition-all hover:shadow-[0_6px_20px_rgba(25,63,127,0.23)] hover:-translate-y-[1px]"
            >
              Sign In
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
