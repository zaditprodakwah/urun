import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://urunwarga.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/tentang',
        '/kebijakan-privasi',
        '/syarat-ketentuan',
        '/kontak',
        '/catalog',
        '/leaderboard'
      ],
      disallow: [
        '/dashboard/',
        '/admin/',
        '/api/',
        '/multisig/',
        '/login/'
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
