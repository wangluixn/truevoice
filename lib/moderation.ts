// OpenAI 内容审核
export interface ModerationResult {
  flagged: boolean
  categories: {
    sexual: boolean
    hate: boolean
    harassment: boolean
    'self-harm': boolean
    'sexual/minors': boolean
    'hate/threatening': boolean
    'violence/graphic': boolean
    'self-harm/intent': boolean
    'self-harm/instructions': boolean
    'harassment/threatening': boolean
    violence: boolean
  }
  reason?: string
}

export async function moderateContent(content: string): Promise<ModerationResult> {
  const openaiApiKey = process.env.OPENAI_API_KEY

  // 如果没有配置 OpenAI API Key，跳过审核
  if (!openaiApiKey) {
    console.warn('OpenAI API Key not configured, skipping moderation')
    return {
      flagged: false,
      categories: {
        sexual: false,
        hate: false,
        harassment: false,
        'self-harm': false,
        'sexual/minors': false,
        'hate/threatening': false,
        'violence/graphic': false,
        'self-harm/intent': false,
        'self-harm/instructions': false,
        'harassment/threatening': false,
        violence: false,
      },
    }
  }

  try {
    const response = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        input: content,
      }),
    })

    if (!response.ok) {
      console.error('Moderation API error:', response.status)
      // API 失败时允许通过，避免阻止正常用户
      return {
        flagged: false,
        categories: {
          sexual: false,
          hate: false,
          harassment: false,
          'self-harm': false,
          'sexual/minors': false,
          'hate/threatening': false,
          'violence/graphic': false,
          'self-harm/intent': false,
          'self-harm/instructions': false,
          'harassment/threatening': false,
          violence: false,
        },
      }
    }

    const data = await response.json()
    const result = data.results[0]

    let reason = ''
    if (result.flagged) {
      const flaggedCategories = Object.entries(result.categories)
        .filter(([_, flagged]) => flagged)
        .map(([category]) => category)
      reason = `Content flagged for: ${flaggedCategories.join(', ')}`
    }

    return {
      flagged: result.flagged,
      categories: result.categories,
      reason,
    }
  } catch (error) {
    console.error('Moderation error:', error)
    // 出错时允许通过
    return {
      flagged: false,
      categories: {
        sexual: false,
        hate: false,
        harassment: false,
        'self-harm': false,
        'sexual/minors': false,
        'hate/threatening': false,
        'violence/graphic': false,
        'self-harm/intent': false,
        'self-harm/instructions': false,
        'harassment/threatening': false,
        violence: false,
      },
    }
  }
}
