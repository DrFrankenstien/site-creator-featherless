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
      <body>{children}{/* impeccable-live-start */}
<script src="http://localhost:8402/live.js?token=b9aea02f-7f33-4cac-abf7-c600c3bf6fd0"></script>
{/* impeccable-live-end */}
</body>
    </html>
  );
}
