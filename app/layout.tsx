import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import Nav from "@/components/Nav";
import ScrollProgress from "@/components/ScrollProgress";

export const metadata: Metadata = {
  title: "Chaitanya Tripathi — Builder & Researcher",
  description:
    "First-year CS + Entrepreneurship student at Ashoka University building production-scale systems — college-admissions intelligence, food-safety pipelines, restaurant analytics — and studying computational holography.",
  openGraph: {
    title: "Chaitanya Tripathi — Builder & Researcher",
    description:
      "Production-scale ML systems and computational-holography research. CollegeOS, FoodSafe India, Meza, HoloForge.",
    url: "https://ctport2026.vercel.app",
    siteName: "Chaitanya Tripathi",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://api.fontshare.com"
          crossOrigin=""
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@700,600,500&f[]=instrument-sans@400,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="grain bg-base text-white antialiased">
        <ScrollProgress />
        <CustomCursor />
        <Nav />
        {children}
      </body>
    </html>
  );
}
