# 二轮行业资讯网站

一个展示二轮行业资讯的静态网站，支持燃油车和电动车分类浏览。

## 功能特性

- 今日总结：展示当日汽车行业重要资讯
- 历史文章：浏览历史文章列表
- 分类筛选：支持燃油车和电动车分类
- 搜索功能：按关键词搜索文章标题（本地搜索）
- 响应式设计：适配不同屏幕尺寸
- 安全性：API密钥存储在服务端环境变量中，不暴露在前端

## 项目结构

```
2.9_qbzs/
├── index.html          # 主页面
├── app.js             # 应用逻辑
├── style.css          # 样式文件
├── api/               # Vercel Serverless Functions
│   └── data.js        # 数据API接口（今日总结、历史文章）
├── server.js          # 本地开发服务器
├── package.json        # 项目配置
├── vercel.json        # Vercel部署配置
├── VERSIONS.md        # 版本历史
├── v1.0/            # 版本备份
├── v1.1/            # 版本备份
└── v2.0/            # 版本备份
```

## 本地运行

1. 克隆或下载项目
2. 安装依赖：
   ```bash
   npm install
   ```
3. 创建环境变量文件：
   ```bash
   # 复制环境变量模板
   cp .env.example .env
   ```
4. 编辑 `.env` 文件，填入你的API密钥
5. 启动本地服务器：
   ```bash
   npm run dev
   ```
6. 在浏览器中打开 `http://localhost:3000`

**注意**：
- 本地开发时使用 `npm run dev` 启动Express服务器
- 如果只想测试静态页面（不调用API），可以使用 `npm run dev:static`
- 部署到Vercel时，会自动使用Vercel的Serverless Functions

## Vercel 部署

### 方法一：通过 Vercel CLI 部署

1. 安装 Vercel CLI：
   ```bash
   npm install -g vercel
   ```

2. 在项目根目录运行：
   ```bash
   vercel
   ```

3. 按照提示操作：
   - 登录 Vercel 账号
   - 选择项目设置
   - 确认部署

### 方法二：通过 Vercel 网站部署

1. 访问 [Vercel](https://vercel.com)
2. 登录或注册账号
3. 点击 "New Project"
4. 导入项目：
   - 选择 "Import Git Repository"
   - 或选择 "Upload" 上传项目文件
5. 配置项目：
   - Framework Preset: Other
   - Root Directory: `./`
   - Build Command: 留空
   - Output Directory: `./`
6. 点击 "Deploy"

### 方法三：通过 GitHub 集成部署

1. 将项目推送到 GitHub 仓库
2. 在 Vercel 中导入该仓库
3. Vercel 会自动检测配置并部署
4. 每次推送代码会自动重新部署

## 环境变量

部署到 Vercel 后，需要在项目设置中配置以下环境变量：

1. 在 Vercel 项目设置中
2. 进入 "Environment Variables"
3. 添加以下环境变量：

| 变量名 | 说明 | 示例值 | 必需 |
|---------|------|---------|------|
| `COZE_API_KEY` | 扣子API的访问令牌 | `pat_xxxxx...` | ✅ 是 |
| `APP_ID` | 扣子应用ID | `7493723704057675788` | ✅ 是 |
| `WORKFLOW_ID_CATEGORY1` | 燃油车工作流ID | `7494575042313093157` | ✅ 是 |
| `WORKFLOW_ID_CATEGORY2` | 电动车工作流ID | `7518324620240551962` | ✅ 是 |

**重要提示**：
- 所有环境变量都是必需的
- `COZE_API_KEY` 请从扣子平台获取，不要泄露
- 工作流ID和APP_ID可以在代码中配置，也可以通过环境变量覆盖
- 环境变量配置后需要重新部署才能生效

## 本地开发

本地开发时，可以复制 `.env.example` 文件为 `.env`，并填入实际的API密钥：

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，填入你的API密钥
```

**注意**：`.env` 文件已添加到 `.gitignore`，不会被提交到Git仓库。

## 版本管理

使用提供的版本管理脚本：

```powershell
# 查看所有版本
.\version-manager.ps1 -List

# 创建新版本（自动版本号）
.\version-manager.ps1

# 创建指定版本
.\version-manager.ps1 -Version 1.2 -Message "更新了搜索功能"
```

## 技术栈

- HTML5
- CSS3
- JavaScript (ES6+)
- Marked.js (Markdown 解析)
- Vercel (部署平台)

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 许可证

MIT

## 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 Issue
- 发送邮件

---

**注意**：这是一个静态网站，无需后端服务器。所有数据通过 API 获取。
