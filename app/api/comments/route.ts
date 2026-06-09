import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { checkRateLimit, recordAction, getClientIP, hashIP } from '@/lib/rate-limit'
import { moderateContent } from '@/lib/moderation'

const COMMENT_RATE_LIMIT = { count: 10, windowMinutes: 60 } // 每小时10条评论

// GET - 获取某个秘密的评论列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const secretId = searchParams.get('secretId')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!secretId) {
      return NextResponse.json({ error: 'secretId is required' }, { status: 400 })
    }

    // 获取总评论数
    const { count } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('secret_id', secretId)

    // 获取评论列表
    const { data, error } = await supabase
      .from('comments')
      .select('id, content, likes, created_at')
      .eq('secret_id', secretId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Fetch comments error:', error)
      return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
    }

    return NextResponse.json({ comments: data || [], total: count || 0 })
  } catch (error) {
    console.error('GET /api/comments error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - 发布新评论
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { secretId, content } = body

    // 验证输入
    if (!secretId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: secretId, content' },
        { status: 400 }
      )
    }

    // 验证内容长度
    if (content.length < 10 || content.length > 300) {
      return NextResponse.json(
        { error: 'Comment must be between 10 and 300 characters' },
        { status: 400 }
      )
    }

    // 获取客户端 IP 并哈希
    const clientIP = getClientIP(request.headers)
    const ipHash = hashIP(clientIP)

    // 检查速率限制
    const rateLimit = await checkRateLimit(
      ipHash,
      'post',
      COMMENT_RATE_LIMIT.count,
      COMMENT_RATE_LIMIT.windowMinutes
    )

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: `Rate limit exceeded. You can post ${COMMENT_RATE_LIMIT.count} comments per hour.`,
          remainingCount: 0
        },
        { status: 429 }
      )
    }

    // AI 内容审核
    const moderation = await moderateContent(content)
    
    if (moderation.flagged) {
      return NextResponse.json(
        { 
          error: 'Your comment was flagged by our moderation system. Please follow community guidelines.',
          details: moderation.reason,
          flagged: true
        },
        { status: 400 }
      )
    }

    // 插入数据库
    const { data, error } = await supabase
      .from('comments')
      .insert({
        secret_id: secretId,
        content,
        ip_hash: ipHash,
      })
      .select()
      .single()

    if (error) {
      console.error('Insert comment error:', error)
      return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 })
    }

    // 记录操作
    await recordAction(ipHash, 'post')

    return NextResponse.json({ 
      success: true, 
      comment: data,
      remainingComments: rateLimit.remainingCount - 1
    }, { status: 201 })
  } catch (error) {
    console.error('POST /api/comments error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
