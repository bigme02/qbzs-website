## v1.0 - 2026-02-09 13:19:00

初始版本

---
## v1.1 - 2026-02-09 13:40:21

历史文章增加作者标签、优化布局间距

---
## v2.0 - 2026-02-09 15:36:00

安全性升级：所有API调用通过Vercel Serverless Functions，API密钥存储在环境变量中，不暴露在前端代码

---
## v2.1 - 2026-02-09 15:45:00

优化搜索功能：移除扣子搜索工作流，改为本地搜索历史文章标题

---
## v2.2 - 2026-02-09 15:50:00

修复日期范围参数错误：修正dateNum参数传递，确保查看过去1天和2天的内容正确显示

---
## v2.3 - 2026-02-09 15:55:00

修复dateNum参数处理bug：将dateNum || 1改为dateNum !== undefined ? dateNum : 1，确保dateNum=0时能正确传递

---
## v2.4 - 2026-02-09 16:10:00

修复Vercel部署路由问题：在vercel.json中添加"handle": "filesystem"规则，确保静态文件（app.js、style.css）能正确加载，避免返回HTML导致的JavaScript语法错误

---
## v2.5 - 2026-02-09 16:20:00

移除vercel.json中的builds配置：删除不必要的builds配置，避免与Vercel项目设置中的Build & Development Settings冲突，消除警告信息

---
## v2.6 - 2026-02-09 16:25:00

修复Vercel部署输出目录错误：在vercel.json中添加outputDirectory配置，设置为"."（根目录），解决"No Output Directory named 'public' found"错误

---
## v2.7 - 2026-02-09 16:30:00

优化搜索功能：扩展搜索范围，现在可以同时搜索文章标题和总结内容，提高搜索准确性和用户体验

---
