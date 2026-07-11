import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Movie Management System",
  description: "Movie Management System using Next.js and NestJS",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
