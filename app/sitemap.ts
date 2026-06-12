import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://truevoice.fit'
  
  // 基础页面
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
  ]

  try {
    // 获取所有秘密ID（用于生成详情页URL）
    const { data: secrets } = await supabase
      .from('secrets')
      .select('id, created_at')
      .order('created_at', { ascending: false })
      .limit(1000) // 限制数量避免sitemap过大

    if (secrets) {
      secrets.forEach((secret) => {
        routes.push({
          url: `${baseUrl}/secret/${secret.id}`,
          lastModified: new Date(secret.created_at),
          changeFrequency: 'daily',
          priority: 0.8,
        })
      })
    }
  } catch (error) {
    console.error('Failed to fetch secrets for sitemap:', error)
  }

  return routes
}
