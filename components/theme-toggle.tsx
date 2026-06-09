"use client"

import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    const initialTheme = savedTheme || "dark"
    
    setTheme(initialTheme)
    document.documentElement.className = initialTheme
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.className = newTheme
  }

  if (!mounted) {
    return <button className="w-10 h-10 rounded-lg bg-gray-800" />
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 flex items-center justify-center transition-all duration-300 hover:scale-110"
      aria-label="切换主题"
    >
      {theme === "dark" ? (
        <Moon className="h-5 w-5 text-blue-400" />
      ) : (
        <Sun className="h-5 w-5 text-yellow-500" />
      )}
    </button>
  )
}
