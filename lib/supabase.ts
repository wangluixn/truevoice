import { createClient } from '@supabase/supabase-js'

// Supabase 客户端配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// 兼容新旧版本的 key 名称
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 数据库类型定义
export interface Secret {
  id: string
  content: string
  category: string
  lang: string
  likes: number
  created_at: string
  ip_hash?: string
}

export interface SecretInsert {
  content: string
  category: string
  lang: string
  ip_hash?: string
}
