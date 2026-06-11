import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@/components/google-analytics';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrueVoice - 深夜的秘密 | 匿名倾诉树洞",
  description: "匿名分享你的真心话，这里没有评判，只有倾听。深夜失眠想找人聊天？工作压力大想吐槽？分手后的心里话无处诉说？来 TrueVoice 匿名倾诉你的秘密。",
  keywords: ["匿名树洞", "匿名倾诉", "秘密分享", "深夜树洞", "情感倾诉", "anonymous confessions", "secret sharing", "digital sanctuary"],
  authors: [{ name: "TrueVoice" }],
  creator: "TrueVoice",
  publisher: "TrueVoice",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://truevoice.fit",
    siteName: "TrueVoice",
    title: "TrueVoice - 深夜的秘密 | 匿名倾诉树洞",
    description: "匿名分享你的真心话，这里没有评判，只有倾听",
    images: [
      {
        url: "https://truevoice.fit/og-image.png",
        width: 1200,
        height: 630,
        alt: "TrueVoice - 匿名倾诉你的秘密",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TrueVoice - 深夜的秘密",
    description: "匿名分享你的真心话，这里没有评判，只有倾听",
    images: ["https://truevoice.fit/og-image.png"],
  },
  alternates: {
    canonical: "https://truevoice.fit",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full w-full flex flex-col" suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const RTL_LANGUAGES = ['ar'];
                  const savedLang = localStorage.getItem('language');
                  const isRTL = savedLang && RTL_LANGUAGES.includes(savedLang);
                  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
                } catch (e) {}
              })();
            `,
          }}
        />
        {children}
        <Analytics />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
