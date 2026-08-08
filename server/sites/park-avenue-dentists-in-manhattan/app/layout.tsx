import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Park Avenue Dentists | Elite Cosmetic & Restorative Dentistry Manhattan",
  description: "Experience premier cosmetic, implant, and restorative dentistry at Park Avenue Dentists in Manhattan. Discover bespoke smile design in our luxury state-of-the-art office.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        {children}
      {/* impeccable-live-start */}
<script src="http://localhost:8403/live.js?token=7142bea3-73a4-46da-a41a-70856827de03"></script>
{/* impeccable-live-end */}
</body>
    </html>
  );
}
