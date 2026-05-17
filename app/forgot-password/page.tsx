import { Metadata } from "next";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your Jaiz Admin Dashboard password",
};

const ForgotPasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 font-sans">
      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPasswordPage;
