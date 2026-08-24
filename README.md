# BEIMU

郑荣成的个人作品集网站，聚焦 3D 建模、AI 开发与新媒体视频运营。

当前开发阶段：P4 文件式作品列表与个人介绍 / 联系模块框架。

## 本地开发

```bash
npm install
npm run dev
```

## 当前范围

- Next.js 16、React 19、TypeScript、Tailwind CSS 4。
- 三 Stage 首页：全屏作品视频、四分类目录，以及品牌 / 个人介绍 / 联系方式。
- 本地开源字体：Inter Variable + Noto Sans SC Variable。
- 四类作品：3D 场景、AI 开发、3D 产品动画、新媒体视频运营。
- 分类卡全区域点击，并带有卡片扩张至全屏的路由转场。
- 分类作品归档与项目详情均采用静态生成，兼容 GitHub Pages 与 Sites。
- 已接入 ARK-7、科幻场景、dBsource Pro、Yuyakang 与产品动画 V212。
- 新媒体分类保持真实素材待补状态，不使用虚构案例。
- 分类页复用旧作品集的“项目索引 + 大幅预览”交互，并保持整行可点击。
- 首页第三 Stage 包含品牌预留、个人介绍与平台链接窗口。
- 个人电脑素材接入方法见 [`docs/p4-content-handoff.md`](docs/p4-content-handoff.md)。

完整阶段规划见 [`docs/development-plan.md`](docs/development-plan.md)。
