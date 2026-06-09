import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { checkRateLimit, recordAction, getClientIP, hashIP, RATE_LIMITS } from '@/lib/rate-limit'
import { moderateContent } from '@/lib/moderation'

// GET - 获取秘密列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const lang = searchParams.get('lang')
    const category = searchParams.get('category')

    let query = supabase
      .from('secrets')
      .select('id, content, category, lang, likes, created_at')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // 可选的语言过滤
    if (lang) {
      query = query.eq('lang', lang)
    }

    // 可选的分类过滤
    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) {
      console.error('Fetch secrets error:', error)
      return NextResponse.json({ error: 'Failed to fetch secrets' }, { status: 500 })
    }

    // 批量获取评论数
    const secretsWithCommentCount = await Promise.all(
      (data || []).map(async (secret) => {
        const { count } = await supabase
          .from('comments')
          .select('*', { count: 'exact', head: true })
          .eq('secret_id', secret.id)
        
        return {
          ...secret,
          comments_count: count || 0
        }
      })
    )

    return NextResponse.json({ 
      secrets: secretsWithCommentCount, 
      total: secretsWithCommentCount.length 
    })
  } catch (error) {
    console.error('GET /api/secrets error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - 发布新秘密
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, category, lang } = body

    // 验证输入
    if (!content || !category || !lang) {
      return NextResponse.json(
        { error: 'Missing required fields: content, category, lang' },
        { status: 400 }
      )
    }

    // 验证内容长度
    if (content.length < 20 || content.length > 500) {
      return NextResponse.json(
        { error: 'Content must be between 20 and 500 characters' },
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
      RATE_LIMITS.POST.count,
      RATE_LIMITS.POST.windowMinutes
    )

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: `Rate limit exceeded. You can post ${RATE_LIMITS.POST.count} secrets per hour. Please try again later.`,
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
          error: 'Your content was flagged by our AI moderation system. Please ensure your message follows our community guidelines.',
          details: moderation.reason,
          flagged: true
        },
        { status: 400 }
      )
    }

    // 插入数据库
    const { data, error } = await supabase
      .from('secrets')
      .insert({
        content,
        category,
        lang,
        ip_hash: ipHash,
      })
      .select()
      .single()

    if (error) {
      console.error('Insert secret error:', error)
      return NextResponse.json({ error: 'Failed to post secret' }, { status: 500 })
    }

    // 记录操作
    await recordAction(ipHash, 'post')

    return NextResponse.json({ 
      success: true, 
      secret: data,
      remainingPosts: rateLimit.remainingCount - 1
    }, { status: 201 })
  } catch (error) {
    console.error('POST /api/secrets error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
