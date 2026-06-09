"use client"

import { Share2, Link as LinkIcon, Check } from "lucide-react"
import { useState, useRef } from "react"

interface ShareButtonProps {
  secretId: string
  content: string
}

export function ShareButton({ secretId, content }: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [copied, setCopied] = useState(false)
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const url = typeof window !== 'undefined' 
    ? `${window.location.origin}?secret=${secretId}` 
    : ''

  // 截取内容前100个字符
  const shareText = content.length > 100 
    ? content.substring(0, 100) + '...' 
    : content

  const handleCopyLink = async () => {
    try {
      // 检查 clipboard API 是否可用
      if (!navigator.clipboard) {
        // 降级方案：使用传统方法
        const textArea = document.createElement('textarea')
        textArea.value = url
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        
        setCopied(true)
        setTimeout(() => {
          setCopied(false)
          setShowMenu(false)
        }, 2000)
        return
      }
      
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        setShowMenu(false)
      }, 2000)
    } catch (error) {
      // 降级方案
      try {
        const textArea = document.createElement('textarea')
        textArea.value = url
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        
        setCopied(true)
        setTimeout(() => {
          setCopied(false)
          setShowMenu(false)
        }, 2000)
      } catch (fallbackError) {
        // 静默失败
      }
    }
  }

  const handleShareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`
    window.open(twitterUrl, '_blank', 'width=600,height=400')
    setShowMenu(false)
  }

  const handleShareFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    window.open(facebookUrl, '_blank', 'width=600,height=400')
    setShowMenu(false)
  }

  const handleShareWeibo = () => {
    const weiboUrl = `https://service.weibo.com/share/share.php?title=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`
    window.open(weiboUrl, '_blank', 'width=600,height=400')
    setShowMenu(false)
  }

  const handleToggleMenu = () => {
    if (!showMenu && buttonRef.current) {
      // 记录按钮位置
      setButtonRect(buttonRef.current.getBoundingClientRect())
    }
    setShowMenu(!showMenu)
  }

  // 计算菜单位置 - 使用fixed定位避免父元素影响
  const menuStyle = buttonRect ? {
    position: 'fixed' as const,
    bottom: `${window.innerHeight - buttonRect.top + 8}px`,
    left: `${buttonRect.left}px`,
  } : {}

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={handleToggleMenu}
        className="flex items-center gap-1 text-gray-500 light:text-gray-600 hover:text-blue-400 transition-colors cursor-pointer"
      >
        <Share2 className="h-4 w-4" />
        <span className="text-sm">分享</span>
      </button>

      {showMenu && (
        <>
          {/* 遮罩层 */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)}
          />
          
          {/* 分享菜单 - 使用fixed定位，不受父元素transform影响 */}
          <div 
            style={menuStyle}
            className="w-48 bg-gray-800 light:bg-white border border-gray-700 light:border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden animate-scale-in"
          >
            <button
              onClick={handleCopyLink}
              className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-700 light:hover:bg-gray-100 transition-colors text-gray-200 light:text-gray-800 cursor-pointer border-none bg-transparent"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-400" />
                  <span className="text-sm">已复制!</span>
                </>
              ) : (
                <>
                  <LinkIcon className="h-4 w-4" />
                  <span className="text-sm">复制链接</span>
                </>
              )}
            </button>

            <button
              onClick={handleShareTwitter}
              className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-700 light:hover:bg-gray-100 transition-colors text-gray-200 light:text-gray-800 cursor-pointer border-none bg-transparent"
            >
              <Share2 className="h-4 w-4" />
              <span className="text-sm">Twitter</span>
            </button>

            <button
              onClick={handleShareFacebook}
              className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-700 light:hover:bg-gray-100 transition-colors text-gray-200 light:text-gray-800 cursor-pointer border-none bg-transparent"
            >
              <Share2 className="h-4 w-4" />
              <span className="text-sm">Facebook</span>
            </button>

            <button
              onClick={handleShareWeibo}
              className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-700 light:hover:bg-gray-100 transition-colors text-gray-200 light:text-gray-800 cursor-pointer border-none bg-transparent"
            >
              <Share2 className="h-4 w-4" />
              <span className="text-sm">微博</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
