"use client"

import { Globe } from "lucide-react"
import { useState } from "react"
import { translations, type Language } from "@/lib/i18n"

interface LanguageToggleProps {
  currentLang: Language
  onLanguageChange: (lang: Language) => void
}

export function LanguageToggle({ currentLang, onLanguageChange }: LanguageToggleProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const languages = Object.entries(translations) as [Language, typeof translations[Language]][]

  // 搜索过滤语言
  const filteredLanguages = languages.filter(([code, lang]) =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-lg bg-gray-800 light:bg-gray-200 hover:bg-gray-700 light:hover:bg-gray-300 flex items-center justify-center transition-all duration-300 hover:scale-110"
        aria-label="选择语言"
      >
        <Globe className="h-5 w-5 text-blue-400 light:text-blue-600" />
      </button>

      {isOpen && (
        <>
          {/* 遮罩层 */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => {
              setIsOpen(false)
              setSearchTerm("")
            }}
          />
          
          {/* 下拉菜单 */}
          <div className="absolute ltr:right-0 rtl:left-0 mt-2 w-56 bg-gray-800 light:bg-white border border-gray-700 light:border-gray-200 rounded-lg shadow-lg z-50 animate-scale-in">
            {/* 搜索框 */}
            <div className="p-2 border-b border-gray-700 light:border-gray-200">
              <input
                type="text"
                placeholder="搜索语言..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 light:bg-gray-100 text-gray-200 light:text-gray-800 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* 语言列表 */}
            <div className="max-h-96 overflow-y-auto">
              {filteredLanguages.length > 0 ? (
                filteredLanguages.map(([code, lang]) => (
                  <button
                    key={code}
                    onClick={() => {
                      onLanguageChange(code)
                      setIsOpen(false)
                      setSearchTerm("")
                    }}
                    className={`w-full px-4 py-3 text-start flex items-center gap-3 hover:bg-gray-700 light:hover:bg-gray-100 transition-colors ${
                      currentLang === code ? 'bg-gray-700 light:bg-blue-50' : ''
                    }`}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="text-gray-200 light:text-gray-800 font-medium text-sm">{lang.name}</span>
                    {currentLang === code && (
                      <span className="ms-auto text-blue-400 light:text-blue-600">✓</span>
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-400 light:text-gray-600 text-sm text-center">
                  未找到语言
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
