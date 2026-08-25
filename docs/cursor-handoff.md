# BEIMU P5 → Cursor 开发交接

更新时间：2026-08-25

## 1. 当前稳定版本

- GitHub 仓库：https://github.com/Bomi11653/BEIMU
- 正式开发基线：main
- GitHub Pages：https://bomi11653.github.io/BEIMU/
- 当前阶段：P5，首页框架、作品分类、作品列表、项目详情、个人介绍和联系方式均已建立。
- chatgpt.site 预览可能被 Cloudflare 拦截，后续验收优先使用 GitHub Pages 或本地开发地址。

## 2. 在个人电脑接手

```bash
git clone https://github.com/Bomi11653/BEIMU.git
cd BEIMU
git switch main
git pull --ff-only
git switch -c feature/cursor-content-p6
npm ci
npm run dev
```

打开 http://localhost:3000。完成一组可检查的修改后再提交到功能分支，不要直接强推 main。

## 3. 当前结构

| 区域 | 入口 | 说明 |
|---|---|---|
| 三 Stage 首页 | src/components/home/HomeStage.tsx | 首屏、四分类、About / Contact |
| Stage 手势 | src/hooks/useStageNavigation.ts | 滚轮、触摸、键盘与滚动容器边界 |
| 四分类数据 | src/data/portfolioCategories.ts | 分类、项目、封面、画廊、外链和静态路径的唯一数据源 |
| 文件式作品列表 | src/components/works/ProjectArchiveList.tsx | 左侧索引、右侧背景、整行和预览均可进入 |
| 路由转场 | src/components/transitions/RouteTransitionProvider.tsx | 上下幕布、加载文字、进度线和重复点击锁 |
| 个人与联系数据 | src/data/profile.ts | BEIMU / LEON 信息、品牌、平台链接 |
| 联系页 | src/components/home/ProfileContactStage.tsx | 平台 Logo 链接与单屏响应式布局 |
| 微信弹窗 | src/components/home/WeChatDialog.tsx | 点击微信 Logo 后显示二维码 |
| 全站字号 | src/styles/design-tokens.css | 标题、正文、导航、编号和微文案 Token |
| P5 视觉 | src/styles/p5.css | 作品列表、About、Contact 和文字导航 |
| 转场视觉 | src/styles/route-transition.css | 旧仓库风格的幕布加载动画 |

## 4. 回到个人电脑后补素材

### 新项目

1. 将素材放入 public/media/works/{category}/{project-slug}/。
2. 推荐包含 cover.jpg、01.jpg—06.jpg、preview.mp4、poster.jpg。
3. 在 src/data/portfolioCategories.ts 复制现有项目对象并填写真实资料。
4. 不要在组件中硬编码新项目，分类列表和详情页应继续共享数据。

### 合作品牌

1. 将透明 PNG、SVG 或 WebP 放入 public/media/brands/。
2. 在 src/data/profile.ts 的 partnerBrands 中添加真实品牌。
3. 未确认的品牌继续保持空状态，不使用占位 Logo 冒充合作案例。

### 联系方式

- 平台链接、Logo、账号名称：src/data/profile.ts。
- 微信二维码：public/media/contact/wechat-qr.png。
- 平台 Logo：public/media/contact/logos/。
- 改完必须逐个验证 Bilibili、小红书、GGAC、GitHub、Gmail 和微信弹窗。

## 5. 已确认的视觉规则

- 整站保持黑色电影感、克制留白和杂志式排版。
- 所有导航只保留文字，不要恢复玻璃胶囊、边框或大面积激活底色。
- 作品列表采用右侧全背景图，并从右向左渐隐到黑色。
- 左侧项目名称和右侧作品图片均可点击进入项目。
- 不随意放大字号；优先使用 design-tokens.css 中的现有字号。
- 字号层级统一为页面标题、身份标题、项目标题、章节标题、正文、导航、标签、编号和微文案。
- 保留键盘焦点、prefers-reduced-motion、手机端布局和 GitHub Pages basePath。

## 6. 下一阶段建议

1. 在个人电脑补齐真实项目素材和正式文案。
2. 完善 ARK-7 作为第一套完整项目详情模板。
3. 补齐科幻场景、dBsource Pro、Yuyakang 和 V212 的职责、工具、流程与成果。
4. 接入真实的新媒体账号案例与数据。
5. 补合作品牌、简历下载、SEO、Open Graph、favicon、404 和性能优化。
6. 最后进行 iPhone Safari、安卓 Chrome、微信内置浏览器和弱网测试。

## 7. 每次提交前验证

```bash
npm run lint
npx tsc --noEmit
npm run build:pages
npm run build:sites
```

GitHub Pages 由 .github/workflows/deploy-pages.yml 在 main 更新后自动部署。

## 8. 给 Cursor 的首条指令

```text
先完整阅读 AGENTS.md 和 docs/cursor-handoff.md，再检查当前代码结构。不要重构现有三 Stage、四分类、文字导航、作品列表和幕布转场。先只整理我要新增的真实项目素材与数据映射，给出将修改的文件清单和实施计划，等我确认后再写代码。
```
