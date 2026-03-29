import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Chaitanya Tripathi — Signal",
  description: "CS undergrad at Ashoka University. I find signal in noise. Products, data, whatever problem I'm obsessed with this month.",
  openGraph: {
    title: "Chaitanya Tripathi — Signal",
    description: "CS undergrad at Ashoka University. Builder.",
    url: "https://ct.work",
    siteName: "CT",
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
        <CustomCursor />
        <Nav />
        {children}
      </body>
    </html>
  );
}
