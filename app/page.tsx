"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { ShareButton } from "@/components/share-button"
import { MessageSquare, Heart, Lock, Moon, Send, Loader2, AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { translations, detectLanguage, type Language, isRTL } from "@/lib/i18n"
import { useState, useEffect } from "react"

interface Secret {
  id: string
  content: string
  category: string
  lang: string
  likes: number
  comments_count?: number
  created_at: string
}

interface Comment {
  id: string
  content: string
  likes: number
  created_at: string
}

export default function Home() {
  const [currentLang, setCurrentLang] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)
  const [secrets, setSecrets] = useState<Secret[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [viewMode, setViewMode] = useState<'all' | 'mine'>('all') // 查看模式：全部/我的
  
  // 发布表单状态
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({ content: '', category: 'life' })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // 评论状态
  const [commentDialogOpen, setCommentDialogOpen] = useState(false)
  const [currentSecretId, setCurrentSecretId] = useState<string | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loadingComments, setLoadingComments] = useState(false)
  const [commentContent, setCommentContent] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [commentError, setCommentError] = useState('')

  useEffect(() => {
    // 使用综合语言检测（IP + 时区 + 浏览器）
    const initLanguage = async () => {
      const { detectLanguageComprehensive } = await import('@/lib/i18n')
      const detectedLang = await detectLanguageComprehensive()
      
      setCurrentLang(detectedLang)
      
      // 如果不是从localStorage读取的，保存检测结果
      if (typeof window !== 'undefined' && !localStorage.getItem('language')) {
        localStorage.setItem('language', detectedLang)
      }
      
      // 设置初始文档方向
      if (typeof document !== 'undefined') {
        document.documentElement.dir = isRTL(detectedLang) ? 'rtl' : 'ltr'
      }
      
      setMounted(true)
    }
    
    initLanguage()
    
    // 加载初始数据
    fetchSecrets()
  }, [])

  // 获取我的秘密ID列表
  const getMySecretIds = (): string[] => {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem('mySecrets')
    return stored ? JSON.parse(stored) : []
  }

  // 保存秘密ID到本地
  const saveMySecretId = (secretId: string) => {
    const mySecrets = getMySecretIds()
    if (!mySecrets.includes(secretId)) {
      mySecrets.unshift(secretId) // 添加到开头
      localStorage.setItem('mySecrets', JSON.stringify(mySecrets))
    }
  }

  // 获取我的秘密数量
  const getMySecretsCount = (): number => {
    return getMySecretIds().length
  }

  // 切换查看模式
  const handleViewModeChange = async (mode: 'all' | 'mine') => {
    if (viewMode === mode) return // 如果已经是当前模式，不重复操作
    
    setViewMode(mode)
    setLoading(true)
    setSecrets([]) // 先清空列表，避免闪烁
    
    // 重新加载数据，明确传入mode参数
    await fetchSecrets(0, mode)
  }

  // 获取秘密列表
  const fetchSecrets = async (offset = 0, mode?: 'all' | 'mine') => {
    try {
      // 如果没有传入mode参数，使用当前viewMode
      const currentMode = mode !== undefined ? mode : viewMode
      
      const response = await fetch(`/api/secrets?limit=12&offset=${offset}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch')
      }
      
      const data = await response.json()
      
      // 根据查看模式过滤
      let filteredSecrets = data.secrets
      if (currentMode === 'mine') {
        const myIds = getMySecretIds()
        filteredSecrets = data.secrets.filter((s: Secret) => myIds.includes(s.id))
      }
      
      if (offset === 0) {
        setSecrets(filteredSecrets)
      } else {
        setSecrets(prev => [...prev, ...filteredSecrets])
      }
      
      setHasMore(data.secrets.length === 12 && currentMode === 'all')
      setLoading(false)
      setLoadingMore(false)
    } catch (error) {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  // 加载更多
  const loadMore = () => {
    setLoadingMore(true)
    // 加载更多时也传入当前的viewMode
    fetchSecrets(secrets.length, viewMode)
  }

  // 处理发布
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')
    setSubmitSuccess(false)
    
    if (formData.content.length < 20 || formData.content.length > 500) {
      setSubmitError(t.dialog.errorLength)
      return
    }
    
    setSubmitting(true)
    
    try {
      const response = await fetch('/api/secrets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: formData.content,
          category: formData.category,
          lang: currentLang,
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to post')
      }
      
      // 成功发布
      setSubmitSuccess(true)
      setFormData({ content: '', category: 'life' })
      
      // 保存到本地记录
      saveMySecretId(data.secret.id)
      
      // 刷新列表 - 使用当前的viewMode
      fetchSecrets(0, viewMode)
      
      // 2秒后关闭对话框
      setTimeout(() => {
        setDialogOpen(false)
        setSubmitSuccess(false)
      }, 2000)
    } catch (error: any) {
      setSubmitError(error.message || '发布失败，请稍后重试')
    } finally {
      setSubmitting(false)
    }
  }

  // 处理点赞 - 乐观更新
  const handleLike = async (secretId: string) => {
    // 立即更新 UI（乐观更新）
    setSecrets(prev => prev.map(secret => 
      secret.id === secretId 
        ? { ...secret, likes: secret.likes + 1 }
        : secret
    ))

    // 后台调用 API
    try {
      const response = await fetch(`/api/secrets/${secretId}/like`, {
        method: 'POST',
      })
      
      if (!response.ok) {
        // 如果失败，回滚 UI 更新
        setSecrets(prev => prev.map(secret => 
          secret.id === secretId 
            ? { ...secret, likes: secret.likes - 1 }
            : secret
        ))
        return
      }
      
      const data = await response.json()
      
      // 使用服务器返回的准确数字同步状态
      setSecrets(prev => prev.map(secret => 
        secret.id === secretId 
          ? { ...secret, likes: data.likes }
          : secret
      ))
    } catch (error) {
      // 网络错误，回滚 UI 更新
      setSecrets(prev => prev.map(secret => 
        secret.id === secretId 
          ? { ...secret, likes: secret.likes - 1 }
          : secret
      ))
    }
  }

  // 打开评论对话框
  const handleOpenComments = async (secretId: string) => {
    setCurrentSecretId(secretId)
    setCommentDialogOpen(true)
    setLoadingComments(true)
    setCommentError('')
    
    try {
      const response = await fetch(`/api/comments?secretId=${secretId}&limit=50`)
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments)
      }
    } catch (error) {
      // 静默失败
    } finally {
      setLoadingComments(false)
    }
  }

  // 提交评论
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentSecretId || commentContent.length < 10) return
    
    setSubmittingComment(true)
    setCommentError('')
    
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secretId: currentSecretId,
          content: commentContent,
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        setCommentError(data.error || t.comments.errorDefault)
        return
      }
      
      // 添加新评论到列表
      setComments(prev => [data.comment, ...prev])
      setCommentContent('')
    } catch (error: any) {
      setCommentError(error.message || t.comments.errorDefault)
    } finally {
      setSubmittingComment(false)
    }
  }

  // 点赞评论 - 乐观更新
  const handleLikeComment = async (commentId: string) => {
    // 立即更新 UI
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ))

    // 后台调用 API
    try {
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
      })
      
      if (!response.ok) {
        // 失败则回滚
        setComments(prev => prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, likes: comment.likes - 1 }
            : comment
        ))
        return
      }
      
      const data = await response.json()
      
      // 同步服务器数据
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes: data.likes }
          : comment
      ))
    } catch (error) {
      // 网络错误回滚
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes: comment.likes - 1 }
          : comment
      ))
    }
  }

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang)
    localStorage.setItem('language', lang)
    
    // 设置文档方向
    if (typeof document !== 'undefined') {
      document.documentElement.dir = isRTL(lang) ? 'rtl' : 'ltr'
    }
  }

  // 渲染加载状态，避免闪烁
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-900 to-gray-950 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    )
  }

  const t = translations[currentLang]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-900 to-gray-950 light:bg-gradient-to-br light:from-blue-50 light:via-white light:to-purple-50 text-gray-100 light:text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 light:border-gray-200 bg-gray-900/50 light:bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Moon className="h-6 w-6 text-blue-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              TrueVoice
            </h1>
          </div>
          <nav className="flex gap-3 items-center">
            <a href="#about" className="text-gray-400 light:text-gray-600 hover:text-blue-400 transition-colors hidden sm:block">{t.header.about}</a>
            <a href="#rules" className="text-gray-400 light:text-gray-600 hover:text-blue-400 transition-colors hidden sm:block">{t.header.rules}</a>
            <LanguageToggle currentLang={currentLang} onLanguageChange={handleLanguageChange} />
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-300 light:text-blue-600 light:bg-blue-100 light:border-blue-300 rounded-full text-sm animate-fade-in">
          <Lock className="h-4 w-4" />
          <span>{t.hero.badge}</span>
        </div>
        
        <h2 className="text-4xl md:text-6xl font-bold mb-6 animate-scale-in">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {t.hero.title}
          </span>
          <br />
          <span className="text-gray-300 light:text-gray-700 text-3xl md:text-5xl">{t.hero.subtitle}</span>
        </h2>
        
        <p className="text-xl text-gray-400 light:text-gray-600 mb-2 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{animationDelay: "0.1s"}}>
          {t.hero.description}
        </p>
        <p className="text-xl text-gray-400 light:text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{animationDelay: "0.1s"}}>
          {t.hero.description2}
        </p>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              size="lg"
              className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{animationDelay: "0.2s"}}
            >
              <MessageSquare className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
              {t.hero.button}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 light:bg-white border-gray-800 light:border-gray-200 text-gray-100 light:text-gray-900">
            <DialogHeader>
              <DialogTitle className="text-2xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {t.dialog.title}
              </DialogTitle>
              <DialogDescription className="text-gray-400 light:text-gray-600">
                {t.dialog.description}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400 light:text-gray-600">{t.dialog.category}</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-gray-800 light:bg-gray-50 border border-gray-700 light:border-gray-300 rounded-lg px-4 py-3 text-gray-100 light:text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                >
                  <option value="love">{t.dialog.categories.love}</option>
                  <option value="family">{t.dialog.categories.family}</option>
                  <option value="work">{t.dialog.categories.work}</option>
                  <option value="life">{t.dialog.categories.life}</option>
                  <option value="other">{t.dialog.categories.other}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400 light:text-gray-600">
                  {t.dialog.label} ({formData.content.length}/500)
                </label>
                <textarea 
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-gray-800 light:bg-gray-50 border border-gray-700 light:border-gray-300 rounded-lg px-4 py-3 text-gray-100 light:text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all min-h-[180px] resize-none"
                  placeholder={t.dialog.placeholder}
                  disabled={submitting}
                />
              </div>
              
              {submitError && (
                <div className="flex items-center gap-2 text-sm text-red-400 light:text-red-600 bg-red-500/10 light:bg-red-50 rounded-lg p-3">
                  <AlertCircle className="h-4 w-4" />
                  <span>{submitError}</span>
                </div>
              )}
              
              {submitSuccess && (
                <div className="flex items-center gap-2 text-sm text-green-400 light:text-green-600 bg-green-500/10 light:bg-green-50 rounded-lg p-3">
                  <span>{t.dialog.publishSuccess}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-xs text-gray-500 light:text-gray-600 bg-gray-800/50 light:bg-blue-50 rounded-lg p-3">
                <Lock className="h-4 w-4" />
                <span>{t.dialog.privacy}</span>
              </div>
              <Button 
                type="submit"
                disabled={submitting || formData.content.length < 20 || formData.content.length > 500}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t.dialog.publishing}
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    {t.dialog.submit}
                  </>
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </section>

      {/* Secrets Feed */}
      <section className="container mx-auto px-4 py-12">
        {/* 标签切换 */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <button
            onClick={() => handleViewModeChange('all')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800/50 light:bg-gray-100 text-gray-400 light:text-gray-600 hover:bg-gray-800 light:hover:bg-gray-200'
            }`}
          >
            {t.feed.title}
          </button>
          <button
            onClick={() => handleViewModeChange('mine')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'mine'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800/50 light:bg-gray-100 text-gray-400 light:text-gray-600 hover:bg-gray-800 light:hover:bg-gray-200'
            }`}
          >
            {t.feed.mySecrets} ({getMySecretsCount()})
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          </div>
        ) : secrets.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>
              {viewMode === 'mine' 
                ? t.feed.noMySecretsYet
                : t.feed.noSecretsYet
              }
            </p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {secrets.map((secret, index) => {
                const isMySecret = getMySecretIds().includes(secret.id)
                return (
                  <Card 
                    key={secret.id} 
                    className="group bg-gray-800/50 light:bg-white border-gray-700/50 light:border-gray-200 hover:border-blue-500/30 hover:bg-gray-800/80 light:hover:bg-gray-50 transition-all duration-300 cursor-pointer animate-fade-in"
                    style={{animationDelay: `${index * 0.05}s`}}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-blue-500/10 text-blue-300 light:text-blue-600 light:bg-blue-100 px-3 py-1 rounded-full border border-blue-500/20 light:border-blue-300">
                            {secret.category}
                          </span>
                          {isMySecret && (
                            <span className="text-xs bg-green-500/10 text-green-300 light:text-green-600 light:bg-green-100 px-2 py-1 rounded-full border border-green-500/20 light:border-green-300">
                              {t.feed.mySecretTag}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 light:text-gray-400">
                          {new Date(secret.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    <p className="text-gray-300 light:text-gray-700 leading-relaxed mb-4 min-h-[60px]">
                      {secret.content}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 light:text-gray-600">
                      <button 
                        onClick={() => handleLike(secret.id)}
                        className="flex items-center gap-1 hover:text-pink-400 transition-colors group cursor-pointer"
                      >
                        <Heart className="h-4 w-4 group-hover:fill-pink-400 group-hover:text-pink-400 transition-all" />
                        <span>{secret.likes}</span>
                      </button>
                      <button 
                        onClick={() => handleOpenComments(secret.id)}
                        className="flex items-center gap-1 hover:text-blue-400 transition-colors cursor-pointer"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>{secret.comments_count || 0}</span>
                      </button>
                      <ShareButton secretId={secret.id} content={secret.content} />
                    </div>
                  </CardContent>
                </Card>
              )})}
            </div>
            
            {hasMore && viewMode === 'all' && (
              <div className="text-center mt-12">
                <Button 
                  onClick={loadMore}
                  disabled={loadingMore}
                  variant="outline" 
                  className="border-gray-700 light:border-gray-300 text-gray-400 light:text-gray-600 hover:bg-gray-800 light:hover:bg-gray-100 hover:text-gray-200 light:hover:text-gray-900"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      加载中...
                    </>
                  ) : (
                    t.feed.loadMore
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Features - Why TrueVoice */}
      <section id="about" className="container mx-auto px-4 py-16 bg-gray-900/30 light:bg-gray-50">
        <h3 className="text-3xl font-bold text-center mb-12 text-gray-200 light:text-gray-800">{t.about.title}</h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="group p-6 border border-gray-800 light:border-gray-200 rounded-xl hover:border-blue-500/30 hover:bg-gray-800/50 light:hover:bg-white light:bg-white/50 transition-all duration-500 hover:-translate-y-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
              <Lock className="h-6 w-6" />
            </div>
            <h4 className="text-xl font-semibold mb-3 text-gray-200 light:text-gray-800">{t.about.features.anonymous.title}</h4>
            <p className="text-gray-400 light:text-gray-600">{t.about.features.anonymous.description}</p>
          </div>
          <div className="group p-6 border border-gray-800 light:border-gray-200 rounded-xl hover:border-purple-500/30 hover:bg-gray-800/50 light:hover:bg-white light:bg-white/50 transition-all duration-500 hover:-translate-y-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
              <Heart className="h-6 w-6" />
            </div>
            <h4 className="text-xl font-semibold mb-3 text-gray-200 light:text-gray-800">{t.about.features.empathy.title}</h4>
            <p className="text-gray-400 light:text-gray-600">{t.about.features.empathy.description}</p>
          </div>
          <div className="group p-6 border border-gray-800 light:border-gray-200 rounded-xl hover:border-pink-500/30 hover:bg-gray-800/50 light:hover:bg-white light:bg-white/50 transition-all duration-500 hover:-translate-y-2">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center text-white text-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
              <Moon className="h-6 w-6" />
            </div>
            <h4 className="text-xl font-semibold mb-3 text-gray-200 light:text-gray-800">{t.about.features.companion.title}</h4>
            <p className="text-gray-400 light:text-gray-600">{t.about.features.companion.description}</p>
          </div>
        </div>
      </section>

      {/* Rules */}
      <section id="rules" className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto bg-gray-800/30 light:bg-white border border-gray-800 light:border-gray-200 rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-6 text-gray-200 light:text-gray-800">{t.rules.title}</h3>
          <div className="space-y-4 text-gray-400 light:text-gray-600">
            {t.rules.list.map((rule, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="text-blue-400 text-xl mt-1">✓</span>
                <p>{rule}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-700 light:border-gray-200">
            <p className="text-sm text-gray-500 light:text-gray-600">
              {t.rules.hotline}: <span className="text-blue-400">400-161-9995</span> / 
              {t.rules.suicide}: <span className="text-blue-400">010-82951332</span>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 light:border-gray-200 mt-20 bg-gray-900/50 light:bg-gray-50">
        <div className="container mx-auto px-4 py-8 text-center text-gray-500 light:text-gray-600">
          <p className="mb-2">© 2026 TrueVoice. {t.footer.tagline}</p>
          <p className="text-sm">{t.footer.privacy}</p>
        </div>
      </footer>

      {/* 评论对话框 */}
      {commentDialogOpen && (
        <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
          <DialogContent className="bg-gray-900 light:bg-white border-gray-800 light:border-gray-200 text-gray-100 light:text-gray-900 max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl text-gray-200 light:text-gray-800">
                {t.comments.title} ({comments.length})
              </DialogTitle>
            </DialogHeader>

            {/* 评论输入框 */}
            <form onSubmit={handleSubmitComment} className="space-y-3 pt-4 border-b border-gray-800 light:border-gray-200 pb-4">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder={t.comments.placeholder}
                className="w-full bg-gray-800 light:bg-gray-50 border border-gray-700 light:border-gray-300 rounded-lg px-4 py-3 text-gray-100 light:text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all min-h-[100px] resize-none"
                disabled={submittingComment}
              />
              {commentError && (
                <div className="flex items-center gap-2 text-sm text-red-400 light:text-red-600 bg-red-500/10 light:bg-red-50 rounded-lg p-3">
                  <AlertCircle className="h-4 w-4" />
                  <span>{commentError}</span>
                </div>
              )}
              <Button
                type="submit"
                disabled={submittingComment || commentContent.length < 10 || commentContent.length > 300}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50"
              >
                {submittingComment ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.comments.publishing}
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    {t.comments.submit} ({commentContent.length}/300)
                  </>
                )}
              </Button>
            </form>

            {/* 评论列表 */}
            <div className="space-y-4 pt-4">
              {loadingComments ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>{t.comments.noComments}</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-gray-800/30 light:bg-gray-50 rounded-lg p-4 border border-gray-700/50 light:border-gray-200"
                  >
                    <p className="text-gray-300 light:text-gray-700 mb-3">{comment.content}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 light:text-gray-400">
                        {new Date(comment.created_at).toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleLikeComment(comment.id)}
                        className="flex items-center gap-1 text-gray-500 hover:text-pink-400 transition-colors cursor-pointer"
                      >
                        <Heart className="h-4 w-4" />
                        <span>{comment.likes}</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
