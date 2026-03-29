import type { Metadata } from "next";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AppPreferencesProvider } from "@/lib/app-preferences";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "DealDrop: Hyperlocal Flash Sale Platform",
  description: "Connect local retailers with nearby shoppers through real-time hyperlocal flash sales."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <AppPreferencesProvider>
          <Navbar />
          <div className="flex-1 pt-[60px] md:pt-[70px]">{children}</div>
          <Footer />
        </AppPreferencesProvider>
      </body>
    </html>
  );
}
