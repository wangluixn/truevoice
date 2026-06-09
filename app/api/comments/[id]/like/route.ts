import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { checkRateLimit, recordAction, getClientIP, hashIP, RATE_LIMITS } from '@/lib/rate-limit'

// POST - 点赞评论
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 })
    }

    // 获取客户端 IP 并哈希
    const clientIP = getClientIP(request.headers)
    const ipHash = hashIP(clientIP)

    // 检查速率限制
    const rateLimit = await checkRateLimit(
      ipHash,
      'like',
      RATE_LIMITS.LIKE.count,
      RATE_LIMITS.LIKE.windowMinutes
    )

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: `Rate limit exceeded. You can like ${RATE_LIMITS.LIKE.count} items per hour.`,
          remainingCount: 0
        },
        { status: 429 }
      )
    }

    // 增加点赞数
    const { error } = await supabase.rpc('increment_comment_likes', { comment_id: id })

    if (error) {
      console.error('Like comment error:', error)
      return NextResponse.json({ error: 'Failed to like comment' }, { status: 500 })
    }

    // 记录操作
    await recordAction(ipHash, 'like')

    // 获取更新后的点赞数
    const { data } = await supabase
      .from('comments')
      .select('likes')
      .eq('id', id)
      .single()

    return NextResponse.json({ 
      success: true, 
      likes: data?.likes || 0,
      remainingLikes: rateLimit.remainingCount - 1
    })
  } catch (error) {
    console.error('POST /api/comments/[id]/like error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
