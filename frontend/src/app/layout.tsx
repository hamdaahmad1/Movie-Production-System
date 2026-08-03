import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "MovieVerse",
  description: "The ultimate destination for movie lovers. Explore now.",
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="bg-navy-900 text-white antialiased">
        <AuthProvider>{children}</AuthProvider>
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            style: {
              background: "#121a33",
              color: "#fff",
              border: "1px solid #232f57",
            },
          }}
        />
      </body>
    </html>
  );
}