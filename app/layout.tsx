import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCurrentUser } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StepUp Shoe Store - Premium Footwear in Cambodia",
  description: "Discover stylish and comfortable shoes for every occasion. From sneakers to formal wear, we have the perfect pair for you.",
  keywords: "shoes, sneakers, running shoes, formal shoes, Cambodia, Phnom Penh, footwear",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Navbar user={user} cartCount={0} />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
