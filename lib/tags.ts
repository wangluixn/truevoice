// 预设标签配置
// 用于发布对话框的智能推荐

export interface Tag {
  name: string
  slug: string
  category: string
}

// 按分类的推荐标签
export const tagsByCategory: Record<string, Tag[]> = {
  love: [
    { name: '#暗恋表白', slug: 'love-confession', category: 'love' },
    { name: '#失恋分手', slug: 'breakup', category: 'love' },
    { name: '#异地恋', slug: 'long-distance', category: 'love' },
    { name: '#出轨背叛', slug: 'cheating', category: 'love' },
    { name: '#单身狗', slug: 'single', category: 'love' },
  ],
  work: [
    { name: '#职场压力', slug: 'work-stress', category: 'work' },
    { name: '#老板吐槽', slug: 'boss-complaint', category: 'work' },
    { name: '#加班熬夜', slug: 'overtime', category: 'work' },
    { name: '#想辞职', slug: 'want-quit', category: 'work' },
    { name: '#职场PUA', slug: 'workplace-pua', category: 'work' },
  ],
  family: [
    { name: '#家庭矛盾', slug: 'family-conflict', category: 'family' },
    { name: '#父母唠叨', slug: 'parents', category: 'family' },
    { name: '#婆媳关系', slug: 'mother-in-law', category: 'family' },
    { name: '#重男轻女', slug: 'gender-bias', category: 'family' },
    { name: '#催婚压力', slug: 'marriage-pressure', category: 'family' },
  ],
  life: [
    { name: '#大学生活', slug: 'college-life', category: 'life' },
    { name: '#考研压力', slug: 'exam-stress', category: 'life' },
    { name: '#失眠焦虑', slug: 'insomnia', category: 'life' },
    { name: '#孤独寂寞', slug: 'lonely', category: 'life' },
    { name: '#经济压力', slug: 'money-stress', category: 'life' },
  ],
  other: [
    { name: '#深夜想法', slug: 'midnight-thoughts', category: 'other' },
    { name: '#秘密树洞', slug: 'secret', category: 'other' },
    { name: '#真心话', slug: 'confession', category: 'other' },
    { name: '#匿名吐槽', slug: 'anonymous-rant', category: 'other' },
  ],
}

// 获取某个分类的推荐标签
export function getRecommendedTags(category: string): Tag[] {
  return tagsByCategory[category] || []
}

// 所有标签的扁平列表
export const allTags: Tag[] = Object.values(tagsByCategory).flat()
