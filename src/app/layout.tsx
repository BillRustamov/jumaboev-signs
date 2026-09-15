import type { Viewport } from "next";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Libre_Baskerville, Oswald } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const signSerif = Libre_Baskerville({
  variable: "--font-sign-serif-face",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const signCondensed = Oswald({
  variable: "--font-sign-condensed-face",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Jumaboev Signs — 24×24 FMCSA USDOT door vinyl",
    template: "%s · Jumaboev Signs",
  },
  description:
    "Khurshid Jumaboev prints 24×24 vinyl USDOT door decals. Live preview, color edits, Telegram bot.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${signSerif.variable} ${signCondensed.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <SiteHeader />
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
