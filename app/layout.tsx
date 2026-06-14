import type { Metadata } from "next";
import { Bebas_Neue, Rajdhani, DM_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./provider";
import { ToastContainer } from "react-toastify";

// Display font — bold, industrial, iconic untuk heading utama
const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas",
  weight: "400",
});

// UI font — semi-condensed, tegas untuk subheading & label
const rajdhani = Rajdhani({
  subsets: ["latin"],
  variable: "--font-rajdhani",
  weight: ["400", "500", "600", "700"],
});

// Body font — clean, modern, readable untuk konten
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Garage Custom - Build Your Dream Motorcycle",
  description: "Custom motorcycle garage with premium builds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${rajdhani.variable} ${dmSans.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col font-sans bg-neutral-900 text-white">
        <Providers>{children}</Providers>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          theme="dark"
        />
      </body>
    </html>
  );
}