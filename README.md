# TrueVoice - 深夜的秘密

> 匿名分享真心话的平台，没有评判，只有倾听

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/你的用户名/truevoice)

## ✨ 功能特性

### 核心功能
- 🔒 **完全匿名** - 无需注册，不记录IP，绝对隐私
- 💭 **发布秘密** - 20-500字符，5个分类（感情、家庭、工作、生活、其他）
- 🤖 **AI内容审核** - OpenAI Moderation API 自动过滤不当内容
- ❤️ **点赞系统** - 乐观更新，流畅体验
- 💬 **评论功能** - 完整的评论和点赞
- 📤 **分享功能** - 复制链接、Twitter、Facebook、微博
- 📝 **我的秘密** - 本地记录，快速查看自己发布的内容

### 国际化
- 🌍 **15种语言** - 完整UI翻译（中文、英语、日语、韩语等）
- 📱 **RTL支持** - 阿拉伯语从右到左显示
- 🔄 **自动检测** - 浏览器语言自动适配
- 💾 **持久化** - 语言偏好保存在本地

### 性能优化
- ⚡ **速率限制** - 防止滥用（5次发布/小时，50次点赞/小时）
- 🚀 **乐观更新** - 点赞立即响应，无需等待
- 📦 **批量查询** - 评论数一次性加载，提升速度

### UI/UX
- 🌙 **暗色模式** - 默认暗色主题，护眼舒适
- 📱 **响应式设计** - 完美适配移动端
- ✨ **流畅动画** - 加载、切换、悬停效果

---

## 🚀 快速开始

### 本地开发

```bash
# 克隆项目
git clone https://github.com/你的用户名/truevoice.git
cd truevoice/my-saas-starter

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入你的配置

# 启动开发服务器
npm run dev
```

访问 http://localhost:3005

### 部署到 Vercel

**5分钟快速部署** → 查看 [QUICK-DEPLOY.md](./QUICK-DEPLOY.md)

**详细部署指南** → 查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/你的用户名/truevoice)

---

## 📋 环境变量

| 变量名 | 必需 | 说明 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase 项目 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase 匿名密钥 |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | ✅ | Supabase 可发布密钥 |
| `IP_SALT` | ✅ | IP 加密盐值（任意字符串） |
| `OPENAI_API_KEY` | ❌ | OpenAI API 密钥（用于内容审核） |

---

## 🗄️ 数据库设置

### 1. 创建 Supabase 项目

访问 https://supabase.com 创建免费项目

### 2. 运行 SQL 初始化脚本

在 Supabase SQL Editor 中运行：
- `supabase-setup.sql` - 创建主表和 RLS 策略
- `comments-table.sql` - 创建评论表

详细步骤：[SUPABASE-SETUP.md](./SUPABASE-SETUP.md)

---

## 🌐 多语言支持

完整支持15种语言，包括 RTL（从右到左）显示。

详细文档：[LANGUAGE-SUPPORT.md](./LANGUAGE-SUPPORT.md)

**支持的语言**：
中文 | 英语 | 日语 | 韩语 | 西班牙语 | 法语 | 德语 | 葡萄牙语 | 俄语 | 印地语 | 意大利语 | 泰语 | 越南语 | 印尼语 | 阿拉伯语

---

## 🛠️ 技术栈

- **前端框架**: Next.js 16.2.7
- **样式**: Tailwind CSS v4
- **UI组件**: shadcn/ui（手动配置）
- **数据库**: Supabase（PostgreSQL）
- **部署**: Vercel
- **AI审核**: OpenAI Moderation API
- **语言**: TypeScript

---

## 📊 成本估算

### 免费额度（足够小型项目）

**Vercel**:
- ✅ 100 GB 带宽/月
- ✅ 无限部署
- ✅ 自动 HTTPS

**Supabase**:
- ✅ 500 MB 数据库
- ✅ 1 GB 文件存储
- ✅ 50,000 月活用户

**总成本**: $0/月（在免费额度内）

---

## 📈 未来路线图

### 付费功能计划 💎
- [ ] AI 翻译（百度翻译 API）
- [ ] 无限发布（取消速率限制）
- [ ] 优先显示（秘密置顶）
- [ ] 历史记录云端同步
- [ ] 私密回复功能
- [ ] 定制标签
- [ ] 数据导出
- [ ] 去除广告

### 社区功能
- [ ] 热门秘密排行
- [ ] 话题标签系统
- [ ] 用户举报机制
- [ ] 多媒体支持（图片）

---

## 📝 许可证

MIT License

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📧 联系方式

- 项目主页: https://github.com/你的用户名/truevoice
- 问题反馈: https://github.com/你的用户名/truevoice/issues

---

## ⭐ Star History

如果这个项目对你有帮助，请给一个 Star ⭐

---

**Made with ❤️ by TrueVoice Team**
git push -u origin main