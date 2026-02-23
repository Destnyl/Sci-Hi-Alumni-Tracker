import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bernoulli 25'-26' | Alumni Tracking Website",
  description: "Tracking Records for Alumni Contact & Engagement for School Administration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
