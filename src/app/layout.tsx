import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Analytics } from "@vercel/analytics/next"
import { Navbar } from "@/components/navbar"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CSS Playground - CSS filters, backdrop filters, and box shadows",
  description: "A minimalist CSS generator for modern web designers. Light theme only, beige background.",
  verification: {
    google: "8gEvDBelGstZL2v-HkrUwXEApzSAUgMl41WgXdaslSo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Navbar />
        <main className="container mx-auto px-4 pb-20">
          {children}
        </main>

        <footer className="py-12 border-t border-primary/10 mt-auto text-center">
           <div className="container mx-auto px-4">
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
               Made by{" "}
               <a 
                 href="//helloalmaz.com" 
                 target="_blank" 
                 className="text-primary hover:underline underline-offset-4 decoration-2"
               >
                 Almaz Bissenbayev
               </a>
             </p>
           </div>
         </footer>

        <Analytics/>
      </body>
    </html>
  );
}
