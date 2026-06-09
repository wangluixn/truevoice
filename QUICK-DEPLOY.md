# 🚀 快速部署 TrueVoice 到 Vercel

## 5分钟部署步骤

### 1️⃣ 推送代码到 GitHub（2分钟）

```bash
# 在项目根目录 my-saas-starter 执行
git init
git add .
git commit -m "Initial commit: TrueVoice"

# 在 GitHub 创建新仓库后
git remote add origin https://github.com/你的用户名/仓库名.git
git branch -M main
git push -u origin main
```

---

### 2️⃣ 部署到 Vercel（3分钟）

#### 方法 A: 通过网页部署（推荐）

1. 访问 https://vercel.com/new
2. 用 GitHub 账号登录
3. 点击 "Import Git Repository"
4. 选择刚才创建的仓库
5. 点击 "Import"

#### 方法 B: 通过 CLI 部署

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
vercel
```

---

### 3️⃣ 配置环境变量 ⚠️

在 Vercel 项目设置中添加：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://bmayrzmehzyjdemcmaxv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon_key
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=你的publishable_key
IP_SALT=truevoice-secret-salt-2024
OPENAI_API_KEY=sk-你的OpenAI密钥（可选）
```

**添加位置**：
Vercel 项目 → Settings → Environment Variables

---

### 4️⃣ 重新部署

配置环境变量后：
1. 回到 Vercel 项目页面
2. 点击 "Deployments" 
3. 点击最新部署旁的 "..." 按钮
4. 选择 "Redeploy"

---

### 5️⃣ 测试网站 ✅

访问 Vercel 提供的 URL（例如：https://truevoice-xxx.vercel.app）

测试清单：
- [ ] 页面加载正常
- [ ] 可以发布秘密
- [ ] 点赞功能工作
- [ ] 评论功能工作
- [ ] 语言切换正常
- [ ] "我的秘密"显示正常

---

## 🎉 完成！

你的网站已经上线了！

**下一步**：
- 分享给朋友测试
- 配置自定义域名
- 添加网站分析

---

## ⚠️ 常见错误

### 错误1: 500 Internal Server Error

**原因**: 环境变量未配置

**解决**: 
1. 检查 Vercel 环境变量是否都添加了
2. 重新部署

### 错误2: API 请求失败

**原因**: Supabase 配置错误

**解决**:
1. 确认 Supabase URL 和 Key 正确
2. 检查 Supabase 数据库表是否创建
3. 确认 RLS 策略已设置

### 错误3: 样式不正常

**解决**: 清除浏览器缓存，等待1分钟

---

## 📞 需要帮助？

查看完整文档：`DEPLOYMENT.md`
