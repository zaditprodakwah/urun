import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSession } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://urunwarga.vercel.app';

export const metadata: Metadata = {
  title: {
    default: "URUN — Sistem Operasi Mikro-Komunitas Berdaulat",
    template: "%s | URUN",
  },
  description: "Platform gotong royong digital untuk RT/RW dan komunitas lokal Indonesia. Mengamankan uang iuran kas, memotong rantai logistik, dan memvalidasi mufakat tanpa pelacakan komersial.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "URUN — Sistem Operasi Mikro-Komunitas Berdaulat",
    description: "Platform gotong royong digital untuk RT/RW dan komunitas lokal Indonesia.",
    url: siteUrl,
    siteName: "URUN",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "URUN — Sistem Operasi Mikro-Komunitas",
    description: "Sistem Operasi Mikro-Komunitas Berdaulat tingkat RT/RW/Paguyuban.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  
  // Default reputation score for now, this would normally be fetched from the database
  const reputationScore = 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GovernmentBenefitsService",
    "name": "URUN Dana Komunitas",
    "description": "Sistem Operasi Mikro-Komunitas Berdaulat tingkat RT/RW/Paguyuban di Indonesia.",
    "provider": {
      "@type": "Organization",
      "name": "URUN",
      "url": siteUrl
    },
    "areaServed": {
      "@type": "Country",
      "name": "Indonesia"
    }
  };

  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30 selection:text-emerald-300">
        <Navbar session={session} reputationScore={reputationScore} />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
