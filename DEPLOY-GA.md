# Google Analytics 部署步骤

## ✅ 本地代码已配置完成

已完成：
- ✅ `.env.local` 添加了 `NEXT_PUBLIC_GA_ID=G-WMRZHF3GMF`
- ✅ `app/layout.tsx` 集成了 Google Analytics 组件
- ✅ 代码准备就绪

---

## 📤 下一步：推送到 Vercel

### 第 1 步：提交代码
```bash
git add .
git commit -m "feat: 添加 Google Analytics"
git push
```

### 第 2 步：在 Vercel 添加环境变量

1. 打开 Vercel 项目：https://vercel.com/wangluxins-projects/truevoice
2. 点击 **Settings** (设置)
3. 点击左侧 **Environment Variables** (环境变量)
4. 添加新变量：
   - **Key (名称)**: `NEXT_PUBLIC_GA_ID`
   - **Value (值)**: `G-WMRZHF3GMF`
   - **Environment (环境)**: 勾选所有（Production, Preview, Development）
5. 点击 **Save** (保存)

### 第 3 步：重新部署

添加环境变量后，Vercel 会自动触发重新部署。

或者手动触发：
1. 进入 **Deployments** 标签
2. 点击最新部署旁边的 **...** 菜单
3. 选择 **Redeploy** (重新部署)

---

## 🎯 验证 GA 是否生效

### 方法 1：实时报告（5分钟后）
1. 访问 https://analytics.google.com
2. 选择你的属性 "TrueVoice官网数据流"
3. 点击左侧 **报告** → **实时**
4. 打开你的网站 https://truevoice.fit
5. 等待 10-30 秒，应该能看到 1 个活跃用户

### 方法 2：查看网页源代码
1. 访问 https://truevoice.fit
2. 右键 → 查看网页源代码
3. 搜索 `G-WMRZHF3GMF`
4. 如果找到，说明已成功集成

### 方法 3：浏览器开发者工具
1. 打开 https://truevoice.fit
2. 按 F12 打开开发者工具
3. 切换到 **Network** (网络) 标签
4. 刷新页面
5. 搜索 `googletagmanager`
6. 应该能看到对 GA 的请求

---

## 📊 48 小时后可以看到的数据

在 Google Analytics 中，你可以监控：

### 基础数据
- ✅ 访问量、独立访客
- ✅ 页面浏览量
- ✅ 平均会话时长（停留时间）
- ✅ 跳出率

### 地理位置
- ✅ 用户来自哪些国家/地区
- ✅ 城市分布
- ✅ 语言偏好

### 用户行为
- ✅ 用户访问了哪些页面
- ✅ 用户路径（从哪进来，到哪离开）
- ✅ 设备类型（手机/电脑）

### 流量来源
- ✅ 搜索引擎流量
- ✅ 社交媒体流量
- ✅ 直接访问
- ✅ 外部链接

---

## 🔥 下一步：添加事件追踪

等 GA 数据开始收集后（48小时后），可以添加自定义事件追踪：

**示例：追踪按钮点击**
```tsx
// 在需要追踪的地方
onClick={() => {
  // 发送事件到 GA
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'button_click', {
      button_name: '写下你的秘密',
      page_path: window.location.pathname
    })
  }
  // 原有逻辑...
}}
```

这样就能追踪：
- ✅ 有多少人点击了"写下你的秘密"按钮（转化率！）
- ✅ 有多少人点击了评论按钮
- ✅ 有多少人点击了分享按钮

---

## 📈 数据收集时间线

- **0-5 分钟**：实时报告开始显示数据
- **24 小时**：基础报告数据稳定
- **48 小时**：完整的用户行为数据
- **7 天**：可以看到趋势和模式
- **30 天**：可以做月度分析和优化

---

## 需要帮助？

如果遇到问题，检查：
1. ✅ Vercel 环境变量是否添加成功
2. ✅ 部署是否成功（没有报错）
3. ✅ 访问网站查看源代码，确认 GA 代码已加载
4. ✅ Google Analytics 中数据收集是否启用

祝你引流成功！🚀
