import Header from "../components/layout/Header";
import type { Metadata } from "next";
import { PublicAdminLink } from "@/cms/components/PublicAdminLink";
import ScrollReveal from "../components/effects/ScrollReveal";
import "../globals.css";

export const metadata: Metadata = {
  title: "Elvira — Nail Studio & Education",
  description: "Nail studio and education in Leiderdorp.",
};

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header adminLink={<PublicAdminLink />} />
        <ScrollReveal />
        {children}
      </body>
    </html>
  );
}
