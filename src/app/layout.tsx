import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProgressBar from "@/components/ProgressBar";
import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-server";

// Fallback font variables to resolve offline build connection issues during Turbopack compilation
const geistSans = {
  variable: "font-sans-fallback",
};

const geistMono = {
  variable: "font-mono-fallback",
};

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
  
  let reputationScore = 0;
  if (session) {
    try {
      const { data } = await supabaseAdmin
        .from('community_members')
        .select('reputation_score')
        .eq('profile_id', session.profileId)
        .eq('community_id', session.communityId)
        .single();
      if (data) {
        reputationScore = data.reputation_score;
      }
    } catch (err) {
      console.error('Failed to fetch dynamic user reputation score:', err);
    }
  }

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
      <body className="min-h-full flex flex-col bg-surface text-on-surface selection:bg-primary/20 selection:text-primary">
        <ProgressBar />
        <Navbar session={session} reputationScore={reputationScore} />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
