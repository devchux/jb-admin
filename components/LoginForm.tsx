"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      toast.error(error.response?.data.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg border-login-border">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Jaiz Bank Admin
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your credentials to access the admin portal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Username
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                className="pl-10 border-login-border focus:ring-2 focus:ring-login-focus focus:border-transparent transition-all duration-200"
                {...form.register("username", { required: true })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pl-10 pr-10 border-login-border focus:ring-2 focus:ring-login-focus focus:border-transparent transition-all duration-200"
                {...form.register("password", { required: true })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-login-border text-primary focus:ring-login-focus"
              />
              <span className="text-muted-foreground">Remember me</span>
            </label>
            <a
              href="#"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </a>
          </div> */}

          <Button
            type="submit"
            isLoading={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 transition-all duration-200 shadow-sm"
          >
            Sign in
          </Button>
        </form>

        {/* <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <a
              href="#"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Sign up
            </a>
          </p>
        </div> */}
      </CardContent>
    </Card>
  );
};

export default LoginForm;
