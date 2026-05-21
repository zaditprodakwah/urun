import { MetadataRoute } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

export const revalidate = 3600; // Cache sitemap for 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.VERCEL_PROJECT_URL 
    ? `https://${process.env.VERCEL_DOMAIN || 'urunwarga.vercel.app'}`
    : 'https://urunwarga.vercel.app';

  // Base routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/catalog`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/leaderboard`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.5,
    },
  ];

  try {
    // Fetch all public catalog items
    const { data: items } = await supabaseAdmin
      .from('catalog_items')
      .select('slug, updated_at')
      .eq('status', 'public')
      .order('updated_at', { ascending: false });

    if (items && items.length > 0) {
      items.forEach((item) => {
        routes.push({
          url: `${baseUrl}/catalog/${item.slug}`,
          lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        });
      });
    }
  } catch (err) {
    console.error('❌ Error generating dynamic sitemap:', err);
  }

  return routes;
}
