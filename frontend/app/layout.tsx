import type { Metadata } from "next";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Hyperlocal Deal Discovery Platform",
  description: "Discover nearby real-time deals from local retailers."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 pt-[60px] md:pt-[70px]">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
