import { supabase } from './supabase'
import { createHash } from 'crypto'

// 生成 IP 哈希（用于匿名化存储）
export function hashIP(ip: string): string {
  return createHash('sha256').update(ip + process.env.IP_SALT || 'truevoice-salt').digest('hex')
}

// 获取客户端 IP
export function getClientIP(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0] ||
    headers.get('x-real-ip') ||
    'unknown'
  )
}

// 检查速率限制
export async function checkRateLimit(
  ipHash: string,
  actionType: 'post' | 'like',
  limitCount: number,
  timeWindowMinutes: number
): Promise<{ allowed: boolean; remainingCount: number }> {
  const timeWindow = new Date(Date.now() - timeWindowMinutes * 60 * 1000).toISOString()

  // 查询时间窗口内的操作次数
  const { data, error } = await supabase
    .from('rate_limits')
    .select('id')
    .eq('ip_hash', ipHash)
    .eq('action_type', actionType)
    .gte('created_at', timeWindow)

  if (error) {
    console.error('Rate limit check error:', error)
    return { allowed: true, remainingCount: limitCount } // 出错时允许通过
  }

  const currentCount = data?.length || 0
  const remainingCount = Math.max(0, limitCount - currentCount)
  const allowed = currentCount < limitCount

  return { allowed, remainingCount }
}

// 记录操作
export async function recordAction(ipHash: string, actionType: 'post' | 'like'): Promise<void> {
  await supabase
    .from('rate_limits')
    .insert({ ip_hash: ipHash, action_type: actionType })
}

// 速率限制配置
export const RATE_LIMITS = {
  POST: { count: 5, windowMinutes: 60 },    // 每小时最多发布5条
  LIKE: { count: 50, windowMinutes: 60 },   // 每小时最多点赞50次
}
