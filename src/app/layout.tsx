import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Poppins } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Footer from "@/(components)/Footer";
import Navbar from "@/(components)/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Airline Travel",
  description: "Book your flights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased min-h-screen flex flex-col`} 
        style={{fontFamily: "var(--font-poppins), var(--font-geist-sans), system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"}}
      >
        <AuthProvider>
          <Navbar/>
          <main className="flex-1">{children}</main>
          <Footer/>
        </AuthProvider>
        <SpeedInsights/>
      </body>
    </html>
  );
}