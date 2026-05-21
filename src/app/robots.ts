import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.VERCEL_PROJECT_URL 
    ? `https://${process.env.VERCEL_DOMAIN || 'urunwarga.vercel.app'}`
    : 'https://urunwarga.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/catalog',
        '/catalog/',
        '/leaderboard',
      ],
      disallow: [
        '/admin',
        '/dashboard',
        '/login',
        '/api/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
