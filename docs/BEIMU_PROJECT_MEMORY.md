# BEIMU 项目记忆

更新时间：2026-10-24。以已核验实际代码为准，线上状态须独立核验。

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
- Vercel：`vercel.json` 指定 `npm run build:vercel` 和 `.next` 输出目录，使用 Vercel 原生 Next.js 适配；根路径部署。Pages/Sites/OSS 继续独立静态导出。
- 阿里云 OSS 是独立手动部署脚本，不从 Vercel 自动转发。
- Pages 工作流监听 main 和两个旧功能分支，不监听当前 codex 分支。
- TypeScript、Pages/Sites 构建已通过；全仓 ESLint 仍有 7 个错误、3 个警告，尚未修复。
- 正式官网：https://www.beimudesign.top 。实际绑定 Vercel 项目 **beimuwz**（`prj_YhYzkA4gzmH0Vrex7ZtTx1k7Asui`），绑定仓库 `Bomi11653/BEIMU`，productionBranch 为 main。另有 `beimu`、`beimu-ccch` 等项目，不能混作官网发布目标。
- 旧构建失败原因：Next.js 适配器读取 `out/routes-manifest.json`，而 out 是独立静态导出目录。提交 `874bafcca542e628a1018e593adaa456a078fc62` 已改为 `.next` 输出及原生构建，并上传 GitHub。
- 2026-10-23 官网 Production 部署：`dpl_Hs68u3sD8Ma5Rm7yzyoP6BYyJAoc`，状态 READY，发布源码为 `874bafc`，来自 `codex/portfolio-category-projects`，并非 main 已合并。
- 此部署 URL：https://beimuwz-11k8q3rqf-shhsjsasd886-9282s-projects.vercel.app 。官网域名已关联此部署，保留原域名配置。
- 官网页面核验：`/?stage=2` 的首页脚本包含新分类索引；`/works` 为五分类且标注冰锁寒川代表作；平面列表及三个详情均 HTTP 200，详情图数为 9/20/4。抽查三项 WebP 为 HTTP 200、image/webp。未据此声称完成浏览器视觉与点击验收。
- Vercel 历史失败记录不会因新部署成功而消失；验收应查看项目 `beimuwz` 的当前 Production，而非 `beimu` 的旧错误日志。
- 后续应通过审核将功能分支合入 main，使默认生产分支与当前线上源码统一；在此之前不要用旧 main 重新发布覆盖新站。

后续每次发布需核对官网域名、项目名、提交和 Production 状态，并同步本节记录。

## 手机 / 微信修复

- 分支 `codex/mobile-wechat-compat`，详细发现与复测方法见 `docs/mobile-wechat-report.md`。
- 微信/触摸端分类、详情及全局菜单采用直接页面导航，避免幕帘延迟和客户端路由依赖；桌面保留原转场。
- 片头提供跳过、error 和无进度退出，修复透明导航拦截触摸；手机不自动下载背景循环视频。
- 33 张平面缩略图由 37,154,474 字节原图减少到 2,892,814 字节，原图点击后再加载。
- 验证使用隔离 Chromium 的微信 UA 与触摸模拟，不代表已完成 iOS WKWebView / Android X5 微信真机验收。发布后须微信关闭页面重新打开复测。
