import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Props {
  params: Promise<{ id: string }>
}

// 生成静态参数（可选 - 用于预渲染热门页面）
export async function generateStaticParams() {
  const { data: secrets } = await supabase
    .from('secrets')
    .select('id')
    .order('likes', { ascending: false })
    .limit(100)

  if (!secrets) return []

  return secrets.map((secret) => ({
    id: secret.id,
  }))
}

// 动态生成metadata（SEO关键）
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const { data: secret } = await supabase
    .from('secrets')
    .select('content, category, created_at, likes')
    .eq('id', id)
    .single()

  if (!secret) {
    return {
      title: '秘密不存在 | TrueVoice',
    }
  }

  // 取前50个字作为标题
  const title = secret.content.slice(0, 50) + (secret.content.length > 50 ? '...' : '')
  const description = secret.content.slice(0, 160) + (secret.content.length > 160 ? '...' : '')

  return {
    title: `${title} | 匿名倾诉 | TrueVoice`,
    description: `${description} - 在TrueVoice匿名分享你的真心话，这里没有评判，只有倾听`,
    openGraph: {
      title: `${title} | TrueVoice`,
      description: description,
      type: 'article',
      publishedTime: secret.created_at,
      url: `https://truevoice.fit/secret/${id}`,
    },
    twitter: {
      card: 'summary',
      title: `${title} | TrueVoice`,
      description: description,
    },
    alternates: {
      canonical: `https://truevoice.fit/secret/${id}`,
    },
  }
}

export default async function SecretPage({ params }: Props) {
  const { id } = await params
  const { data: secret } = await supabase
    .from('secrets')
    .select('*')
    .eq('id', id)
    .single()

  if (!secret) {
    notFound()
  }

  // 获取评论数
  const { count: commentsCount } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('secret_id', id)

  const categoryNames: Record<string, string> = {
    love: '💝 感情',
    work: '💼 工作', 
    family: '👨‍👩‍👧‍👦 家庭',
    life: '🌟 生活',
    other: '💭 其他',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* 返回首页 */}
          <a 
            href="/"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6"
          >
            ← 返回首页
          </a>

          {/* 秘密卡片 */}
          <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{categoryNames[secret.category]}</span>
              <span className="text-gray-500 text-sm">
                {new Date(secret.created_at).toLocaleDateString('zh-CN')}
              </span>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg leading-relaxed whitespace-pre-wrap">
                {secret.content}
              </p>
            </div>

            <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                ❤️ {secret.likes || 0}
              </span>
              <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                💬 {commentsCount || 0}
              </span>
            </div>
          </article>

          {/* 评论区域可以后续添加 */}
          <div className="mt-8">
            <p className="text-center text-gray-500">
              评论功能开发中...
            </p>
          </div>

          {/* SEO结构化数据 */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Article',
                headline: secret.content.slice(0, 110),
                articleBody: secret.content,
                datePublished: secret.created_at,
                author: {
                  '@type': 'Organization',
                  name: 'TrueVoice',
                },
                publisher: {
                  '@type': 'Organization',
                  name: 'TrueVoice',
                  url: 'https://truevoice.fit',
                },
              }),
            }}
          />
        </div>
      </div>
    </div>
  )
}
