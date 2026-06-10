"use client"

import Script from 'next/script'

export function UmamiAnalytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
  
  if (!websiteId) return null

  return (
    <Script
      async
      src="https://analytics.umami.is/script.js"
      data-website-id={websiteId}
    />
  )
}
