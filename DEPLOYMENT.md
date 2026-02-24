# 部署指南 - 二轮行业资讯网站 v2.1

## 📦 部署文件清单

v2.1文件夹包含以下部署所需文件：

```
v2.1/
├── index.html          # 主页面
├── app.js             # 应用逻辑（无API密钥）
├── style.css          # 样式文件
├── api/               # Vercel Serverless Functions
│   └── data.js        # 数据API接口（今日总结、历史文章）
├── package.json        # 项目配置
├── vercel.json        # Vercel部署配置
├── README.md          # 项目说明
├── .env.example       # 环境变量模板
└── .gitignore         # Git忽略文件
```

## 🚀 部署步骤

### 第一步：创建GitHub仓库

1. 访问 [GitHub](https://github.com) 并登录
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 填写仓库信息：
   - Repository name: `qbzs-website`（或你喜欢的名字）
   - Description: `二轮行业资讯网站`
   - 选择 Public 或 Private（建议Private）
4. 点击 "Create repository"

### 第二步：上传v2.1文件到GitHub

**方法A：使用Git命令行**

```bash
# 进入v2.1文件夹
cd "D:\潮潮数据专用\AI Projects\2.9_qbzs\v2.1"

# 初始化Git仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: v2.1"

# 添加远程仓库（替换为你的GitHub仓库地址）
git remote add origin https://github.com/你的用户名/qbzs-website.git

# 推送到GitHub
git branch -M main
git push -u origin main
```

**方法B：使用GitHub网页上传**

1. 在GitHub仓库页面，点击 "uploading an existing file"
2. 拖拽v2.1文件夹中的所有文件到上传区域
3. 在底部填写提交信息：
   - "Add files via upload"
   - Commit changes: "Initial commit: v2.1"
4. 点击 "Commit changes"

### 第三步：部署到Vercel

1. 访问 [Vercel](https://vercel.com) 并登录
2. 点击 "New Project"
3. 选择 "Import Git Repository"
4. 找到并选择你刚创建的GitHub仓库
5. 配置项目：
   - Framework Preset: Other
   - Root Directory: `./`
   - Build Command: 留空
   - Output Directory: `./`
6. **配置环境变量**（重要！见下文详细说明）
7. 点击 "Deploy"

## 🔐 环境变量配置

### 在哪里配置环境变量？

**答案：在Vercel中配置，不在GitHub中配置！**

### 为什么？

- **GitHub**：代码托管平台，所有代码都是公开的（即使是Private仓库，环境变量也不会自动加密）
- **Vercel**：部署平台，环境变量会自动加密存储，不会暴露在前端代码中

### 配置步骤

1. 在Vercel项目配置页面，找到 "Environment Variables" 部分
2. 点击 "Add New"
3. 逐个添加以下环境变量：

| 变量名 | 说明 | 示例值 | 必需 |
|---------|------|---------|------|
| `COZE_API_KEY` | 扣子API的访问令牌 | `pat_sWXxXusrDUsKLmefPn44ZltEmye8Z2Bi5IapdsBmlWg43Sz1nYjTIlRtK0HhOOIa` | ✅ 是 |
| `APP_ID` | 扣子应用ID | `7493723704057675788` | ✅ 是 |
| `WORKFLOW_ID_CATEGORY1` | 燃油车工作流ID | `7494575042313093157` | ✅ 是 |
| `WORKFLOW_ID_CATEGORY2` | 电动车工作流ID | `7518324620240551962` | ✅ 是 |

4. 每添加一个变量后，点击 "Save"
5. 环境变量配置完成后，点击 "Deploy"

### 重要提示

⚠️ **不要在GitHub中配置环境变量！**

- GitHub的Secrets是用于GitHub Actions的，不是用于Vercel部署的
- 即使在GitHub中配置了Secrets，Vercel也不会自动读取
- 必须在Vercel的项目设置中单独配置

⚠️ **不要把.env文件提交到GitHub！**

- .env文件包含真实的API密钥，绝对不能提交到GitHub
- .gitignore文件已经配置了忽略.env文件
- 只提交.env.example文件作为模板

## 📋 环境变量获取方式

### 1. COZE_API_KEY（扣子API密钥）

1. 访问 [扣子平台](https://www.coze.cn)
2. 登录你的账号
3. 进入 "个人中心" → "API密钥"
4. 点击 "创建密钥"
5. 复制生成的密钥（格式：`pat_xxxxx...`）

### 2. APP_ID（扣子应用ID）

1. 在扣子平台，进入你的工作空间
2. 找到你的应用（汽车行业资讯）
3. 在应用详情页找到 "App ID"
4. 复制这个ID

### 3. WORKFLOW_ID_CATEGORY1（燃油车工作流ID）

1. 在扣子平台，进入你的应用
2. 点击 "工作流"
3. 找到燃油车相关的工作流
4. 在工作流详情页找到 "工作流ID"
5. 复制这个ID

### 4. WORKFLOW_ID_CATEGORY2（电动车工作流ID）

同上，找到电动车相关的工作流ID

## ✅ 部署验证

部署完成后，Vercel会提供一个URL（如：`https://qbzs-website.vercel.app`）

访问这个URL，测试以下功能：

1. ✅ 页面正常加载
2. ✅ 今日总结显示正确
3. ✅ 历史文章列表显示正确
4. ✅ 分类筛选功能正常
5. ✅ 搜索功能正常（本地搜索）
6. ✅ 切换日期范围功能正常

## 🔄 更新部署

当你修改代码后：

1. 提交到GitHub：
   ```bash
   git add .
   git commit -m "描述你的修改"
   git push
   ```

2. Vercel会自动检测到更新并重新部署

3. 或者手动触发部署：
   - 在Vercel项目页面
   - 点击 "Redeploy"

## 🐛 常见问题

### Q1: 部署后API调用失败？

**A:** 检查环境变量是否正确配置：
- 确认所有4个环境变量都已添加
- 确认变量名完全一致（区分大小写）
- 确认变量值没有多余的空格

### Q2: 本地开发正常，部署后不工作？

**A:** 可能的原因：
- 环境变量未配置或配置错误
- API密钥已过期或被撤销
- 检查Vercel的部署日志

### Q3: 如何查看部署日志？

**A:**
1. 在Vercel项目页面
2. 点击 "Deployments"
3. 点击最新的部署记录
4. 点击 "View Function Logs"

### Q4: 如何修改环境变量？

**A:**
1. 在Vercel项目页面
2. 进入 "Settings" → "Environment Variables"
3. 修改或添加变量
4. 点击 "Save"
5. 重新部署项目（环境变量修改后需要重新部署才能生效）

## 📞 技术支持

如果遇到问题：
1. 检查浏览器控制台（F12）的错误信息
2. 查看Vercel的部署日志
3. 确认环境变量配置正确
4. 确认扣子API密钥有效

---

**部署完成后，你的网站就可以正常访问了！** 🎉
