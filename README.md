# BEIMU

郑荣成（LEON）的个人作品集网站，聚焦 3D 场景、AI 开发、3D 产品动画与新媒体视频运营。

当前稳定阶段：P5 作品列表、项目转场、个人介绍与联系平台目录。

## 在线预览

- GitHub Pages：https://bomi11653.github.io/BEIMU/

## 本地开发

```bash
npm ci
npm run dev
```

## 当前范围

- Next.js 16、React 19、TypeScript、Tailwind CSS 4。
- 三 Stage 首页：全屏作品视频、四分类目录、品牌预留 / 个人介绍 / 联系方式。
- 四类作品：3D 场景、AI 开发、3D 产品动画、新媒体视频运营。
- 作品分类页采用左侧文件索引与右侧全背景预览，名称和图片均可进入项目。
- 跨页面使用上下幕布与加载文字转场，并支持减少动态效果。
- 所有导航为纯文字形式，字号由统一设计 Token 管理。
- 联系区包含 Bilibili、小红书、GGAC、GitHub、微信和 Gmail；微信使用二维码弹窗。
- 静态生成兼容 GitHub Pages 与 OpenAI Sites。
- 新媒体分类与合作品牌保持真实素材待补状态，不使用虚构案例。

## Cursor 接手

- 项目约束：AGENTS.md
- 完整交接：docs/cursor-handoff.md
- 素材接入：docs/p4-content-handoff.md
- 阶段规划：docs/development-plan.md

## 验证命令

```bash
npm run lint
npx tsc --noEmit
npm run build:pages
npm run build:sites
```
