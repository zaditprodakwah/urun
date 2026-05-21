import { MetadataRoute } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://urunwarga.vercel.app';
  
  const staticRoutes = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/tentang`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/kebijakan-privasi`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/syarat-ketentuan`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/kontak`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/catalog`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/leaderboard`, lastModified: new Date(), changeFrequency: 'hourly' as const, priority: 0.9 },
  ];

  try {
    // Attempt to fetch public communities or items if we have dynamic pages for them
    // Assuming we might have community profiles in the future, e.g. /community/[slug]
    const { data: communities } = await supabaseAdmin
      .from('communities')
      .select('id, updated_at')
      .limit(100);
      
    if (communities) {
      const dynamicRoutes = communities.map((comm) => ({
        url: `${baseUrl}/community/${comm.id}`,
        lastModified: new Date(comm.updated_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
      return [...staticRoutes, ...dynamicRoutes];
    }
  } catch (error) {
    console.error("Error generating sitemap dynamic routes:", error);
  }

  return staticRoutes;
}
