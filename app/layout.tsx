import type { Metadata } from "next";
import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Jaiz Admin",
    default: "Jaiz Admin Dashboard",
  },
  description: "Administrative dashboard for Jaiz Bank application.",
  icons: {
    icon: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body
      // className={`${plusJakartaSans.variable} ${plusJakartaSans.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
