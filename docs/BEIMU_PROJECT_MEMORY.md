# BEIMU 项目记忆

更新时间：2026-10-22。以已核验实际代码为准，线上状态须独立核验。

## 代码和版本

- 仓库：https://github.com/Bomi11653/BEIMU
- 本地：`D:\项目\BEIMU个人品牌\个人品牌网站\BEIMU`
- 更新分支：`codex/portfolio-category-projects`
- 网站功能提交：`828c181a8a346d9e7ce20ff31d3a232cf38b7d95`，已上传并核验远程 SHA。
- 最近核验 main：`1f3ab4a02288fda5a376b9ed6bd97638c1d65511`，最新网站功能尚未合入 main。

## 架构

- Next.js 16.2.7、React 19、TypeScript。
- 首页五阶段：HOME / ABOUT / WORKS / DOWNLOAD / CONTACT，通过 `?stage=0..4` 控制。
- 首页作品模块与 `/works` 共用 `CategoryIndex`：分类长条入口 → `/works/{category}` 项目列表 → `/works/{category}/{project}` 详情。
- 五个分类：平面海报设计、3D 场景设计、3D 产品动画设计、新媒体视频剪辑、AI 开发。
- 分类代表作由 `representativeProjectId` 指定；3D 场景为冰锁寒川，平面为汉堡。
- 首页第一阶段能力轮播仍独立读取 `featuredCategories.ts` 的四个方向。
- 详情图集：大屏四列、普通桌面三列、手机两列，极窄屏一列。保持图片比例，点击打开原生 dialog，可切换原图尺寸、滚动、Esc 关闭。
- 保留黑色编辑式风格、纯文字导航、幕帘转场和 basePath 资源路径。

## 内容

平面新增三个项目，顺序与图集已核验：

1. 汉堡全套设计：9 张，按已验收 01–09 顺序。
2. 饮品与咖啡全案：20 页，V1.3 FINAL P01–P20。
3. ALL LIVE 万圣节：4 张，按指定目录顺序；部分文件仍标待确认，不推定最终验收或商业上线。

详情见 `docs/graphic-projects-import.md`。原始素材未改动，网页详情资源为无损 WebP。全部项目数据在 `src/data/portfolioCategories.ts`，仅复制素材不会自动新增项目。

## 部署与验证

- 本地开发使用 Webpack，避免此前 Turbopack panic；命令 `npm run dev -- --host 127.0.0.1 --port 3000`。
- Pages 静态导出使用 `GITHUB_PAGES=true`，路径 `/BEIMU`。
- Vercel：`vercel.json` 指定 `npm run build:vercel`，生成根路径静态站点。
- 阿里云 OSS 是独立手动部署脚本，不从 Vercel 自动转发。
- Pages 工作流监听 main 和两个旧功能分支，不监听当前 codex 分支。
- TypeScript、Pages/Sites 构建已通过；全仓 ESLint 仍有 7 个错误、3 个警告，尚未修复。
- 本次同步检查时 Vercel CLI 登录令牌无效，已启动重新授权；项目绑定、线上域名和 Production 状态尚未核验。不得据此宣称 Vercel 已更新。

后续发布成功后，应更新本节的实际部署 URL、版本和状态。
