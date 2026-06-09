# TrueVoice 部署指南

## 部署到 Vercel（推荐）

### 前置准备

1. **GitHub 账号** - 用于托管代码
2. **Vercel 账号** - 免费注册 https://vercel.com
3. **Supabase 数据库** - 已配置完成 ✅
4. **OpenAI API Key** - 用于内容审核（可选）

---

## 步骤 1: 推送代码到 GitHub

### 1.1 初始化 Git 仓库（如果还没有）

```bash
cd my-saas-starter
git init
```

### 1.2 创建 .gitignore（确保不提交敏感信息）

已有 `.gitignore` 文件，确保包含：
```
node_modules/
.next/
.env.local
.env*.local
```

### 1.3 提交代码

```bash
git add .
git commit -m "Initial commit: TrueVoice anonymous confession platform"
```

### 1.4 推送到 GitHub

1. 在 GitHub 创建新仓库（例如：truevoice）
2. 不要添加 README、.gitignore 或 license（本地已有）
3. 复制仓库 URL，然后运行：

```bash
git remote add origin https://github.com/你的用户名/truevoice.git
git branch -M main
git push -u origin main
```

---

## 步骤 2: 在 Vercel 部署

### 2.1 导入项目

1. 访问 https://vercel.com
2. 点击 "Add New..." → "Project"
3. 选择从 GitHub 导入
4. 授权 Vercel 访问你的 GitHub
5. 选择 `truevoice` 仓库
6. 点击 "Import"

### 2.2 配置项目

**Framework Preset**: Next.js（自动检测）
**Root Directory**: `./` （默认）
**Build Command**: `npm run build` （默认）
**Output Directory**: `.next` （默认）

### 2.3 配置环境变量 ⚠️ 重要

在 Vercel 项目设置中添加以下环境变量：

#### 必需的环境变量：

```bash
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://bmayrzmehzyjdemcmaxv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_anon_key
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=你的_publishable_key

# IP 加密盐值
IP_SALT=truevoice-secret-salt-2024
```

#### 可选的环境变量：

```bash
# OpenAI API（内容审核，可选）
OPENAI_API_KEY=sk-...你的OpenAI密钥
```

**添加方式**：
1. 在 Vercel 项目页面，点击 "Settings"
2. 左侧菜单选择 "Environment Variables"
3. 逐个添加上述变量
4. Environment: 选择 "Production, Preview, and Development"

### 2.4 部署

点击 "Deploy" 按钮，等待约 2-3 分钟。

---

## 步骤 3: 验证部署

### 3.1 访问网站

部署成功后，Vercel 会提供一个 URL：
- 默认域名: `https://truevoice-xxx.vercel.app`
- 可以自定义域名

### 3.2 测试功能

- [ ] 页面正常加载
- [ ] 语言切换正常
- [ ] 主题切换正常
- [ ] 发布秘密（测试 API）
- [ ] 点赞功能
- [ ] 评论功能
- [ ] 分享功能
- [ ] "我的秘密"标签
- [ ] 阿拉伯语 RTL 显示

---

## 步骤 4: 配置自定义域名（可选）

### 4.1 在 Vercel 添加域名

1. 项目 Settings → Domains
2. 输入你的域名（例如：truevoice.com）
3. Vercel 会提供 DNS 配置指引

### 4.2 配置 DNS

在你的域名提供商（如阿里云、腾讯云、Cloudflare）：

**A 记录方式**：
```
类型: A
名称: @
值: 76.76.21.21
```

**CNAME 方式**（推荐）：
```
类型: CNAME
名称: www
值: cname.vercel-dns.com
```

等待 DNS 生效（5分钟 - 48小时）

---

## 步骤 5: 配置 Supabase 安全设置

### 5.1 更新允许的域名

1. 访问 Supabase 项目
2. Settings → API
3. 在 "Site URL" 添加你的 Vercel 域名
4. 在 "Redirect URLs" 添加：
   - `https://你的域名.vercel.app/*`
   - `https://你的自定义域名.com/*` （如果有）

---

## 常见问题

### Q1: 部署失败怎么办？

**检查清单**：
- [ ] 确保所有环境变量已添加
- [ ] 检查 Supabase URL 和 Key 是否正确
- [ ] 查看 Vercel 部署日志中的错误信息
- [ ] 确保 `package.json` 中的依赖完整

### Q2: API 请求失败（500错误）

**可能原因**：
- 环境变量未正确配置
- Supabase 数据库表未创建
- RLS 策略未正确设置

**解决方法**：
1. 检查 Vercel 环境变量
2. 重新运行 Supabase SQL 初始化脚本
3. 检查 Supabase 日志

### Q3: 样式丢失或显示不正常

**解决方法**：
- 清除浏览器缓存
- 等待 Vercel CDN 更新（约1分钟）
- 检查 `globals.css` 是否正确加载

### Q4: 如何更新网站？

**方法1**: 自动部署（推荐）
```bash
git add .
git commit -m "更新说明"
git push
```
推送后 Vercel 自动部署（约2分钟）

**方法2**: 手动部署
1. 在 Vercel 项目页面
2. 点击 "Deployments"
3. 点击 "Redeploy"

---

## 性能优化建议

### 1. 启用 Vercel Analytics

```bash
npm install @vercel/analytics
```

在 `app/layout.tsx` 添加：
```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 2. 配置缓存策略

在 `next.config.ts` 添加：
```typescript
export default {
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=60, s-maxage=300' }
      ]
    }
  ]
}
```

### 3. 图片优化

使用 Next.js Image 组件：
```typescript
import Image from 'next/image'

<Image 
  src="/logo.png" 
  alt="Logo" 
  width={200} 
  height={200}
  priority
/>
```

---

## 监控和维护

### 1. Vercel 日志

查看实时日志：
- 项目 → Deployments → 选择部署 → Runtime Logs

### 2. Supabase 监控

- Dashboard → Database → Logs
- 监控 API 使用量、存储空间

### 3. 成本监控

**Vercel 免费额度**：
- 100 GB 带宽/月
- 无限部署
- 自动 HTTPS

**Supabase 免费额度**：
- 500 MB 数据库存储
- 1 GB 文件存储
- 50,000 月活用户

---

## 下一步

- [ ] 配置自定义域名
- [ ] 添加网站分析（Google Analytics / Vercel Analytics）
- [ ] 配置 SEO meta 标签
- [ ] 添加 sitemap.xml
- [ ] 配置社交媒体分享卡片
- [ ] 性能优化和监控

---

## 技术支持

遇到问题？
1. 查看 Vercel 文档: https://vercel.com/docs
2. Supabase 文档: https://supabase.com/docs
3. Next.js 文档: https://nextjs.org/docs

---

## 部署清单

在部署前确保：
- [x] 代码推送到 GitHub
- [x] Vercel 项目创建
- [x] 环境变量配置完成
- [x] Supabase 数据库就绪
- [x] 测试所有功能
- [ ] 自定义域名配置（可选）
- [ ] Analytics 配置（可选）
