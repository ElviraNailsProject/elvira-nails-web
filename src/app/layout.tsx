import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elvira — Nail Studio & Education",
  description: "Nail studio and education in Leiderdorp.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
