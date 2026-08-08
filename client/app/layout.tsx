import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SiteCreator — Automated Leads Scraper & Next.js Site Deployer",
  description: "Extract local service business leads from public directories and instantly deploy custom Next.js landing pages for outreach.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
