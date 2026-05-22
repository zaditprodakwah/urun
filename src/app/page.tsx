import React from 'react';
import LandingClient from '@/components/landing/LandingClient';
import LivingSocialProof from '@/components/landing/LivingSocialProof';

export const metadata = {
  title: "Gerakan Gotong Royong Digital URUN - Simpul RT/RW Warga",
  description: "Sovereign Community Operating System gratis untuk transparansi kas RT/RW, isolasi privasi data warga, dan pengadaan kas sirkular lokal.",
};

export default function LandingPage() {
  return (
    <>
      <LandingClient />
      <LivingSocialProof />
    </>
  );
}
