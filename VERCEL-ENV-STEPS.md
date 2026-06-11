# Vercel 环境变量添加步骤（图文版）

## 第 1 步：找到环境变量设置

在你当前的 Vercel 界面：

1. 看到左侧菜单栏
2. 找到 **Environment Variables** （带齿轮图标 ⚙️）
3. 点击进入

或者直接访问：
https://vercel.com/wangluxins-projects/truevoice/settings/environment-variables

---

## 第 2 步：添加新的环境变量

1. 点击右上角的 **Add New** 按钮（或 **Create** 按钮）

2. 填写表单：
   ```
   Key (名称):     NEXT_PUBLIC_GA_ID
   Value (值):     G-WMRZHF3GMF
   ```

3. 选择环境（Environment）：
   - ✅ Production (生产环境) - 勾选
   - ✅ Preview (预览环境) - 勾选  
   - ✅ Development (开发环境) - 勾选
   
   **建议全部勾选**，这样所有环境都能使用 GA。

4. 点击 **Save** (保存)

---

## 第 3 步：触发重新部署

添加环境变量后，有两种方式：

### 方式 1：自动重新部署（推荐）
Vercel 会弹出提示：
```
"Environment variable added. Redeploy to apply changes?"
```
点击 **Redeploy** 即可。

### 方式 2：手动重新部署
1. 回到 **Overview** 或 **Deployments** 页面
2. 找到最新的部署记录
3. 点击右侧的 **...** 三点菜单
4. 选择 **Redeploy** (重新部署)
5. 确认重新部署

---

## 第 4 步：等待部署完成

- 通常需要 1-3 分钟
- 状态变成 **Ready** ✓ 就完成了

---

## 第 5 步：验证是否生效

### 方法 1：查看网页源代码
1. 访问 https://truevoice.fit
2. 右键 → **查看网页源代码**
3. 按 `Ctrl + F` 搜索：`G-WMRZHF3GMF`
4. 如果找到了，说明成功！

### 方法 2：查看 Google Analytics 实时数据
1. 访问 https://analytics.google.com
2. 点击左侧 **报告** → **实时**
3. 打开你的网站 https://truevoice.fit
4. 10-30 秒后应该能看到 1 个活跃用户

---

## 常见问题

### Q: 添加后看不到效果？
A: 需要重新部署才能生效，确保点击了 Redeploy。

### Q: 重新部署后还是没效果？
A: 
1. 检查环境变量的 Key 是否正确：`NEXT_PUBLIC_GA_ID`（大小写要完全一致）
2. 检查 Value 是否正确：`G-WMRZHF3GMF`
3. 清除浏览器缓存，刷新页面

### Q: 在哪里查看所有环境变量？
A: 左侧菜单 → Environment Variables，可以看到所有已添加的变量。

---

## 截图参考位置

在你的截图中：
```
左侧菜单：
☐ Overview
☐ Deployments  
☐ Logs
☐ Analytics
☐ Speed Insights
☐ Observability
☐ Firewall
☐ CDN
⚙️ Environment Variables  ← 点这里！
☐ Domains
☐ Connect
☐ Integrations
☐ Storage
☐ Flags
```

点击 **Environment Variables** 就能进入设置页面了！
