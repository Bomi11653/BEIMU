# BEIMU P4｜个人电脑素材接入说明

P4 的页面结构与交互由统一数据文件驱动。回到个人电脑后，不需要重新改页面组件，只需放入真实素材并补齐数据。

## 1. 作品文件

按分类存入：

```text
public/media/works/
├── 3d-scene/{project-slug}/
├── ai-development/{project-slug}/
├── 3d-product-motion/{project-slug}/
└── new-media/{project-slug}/
```

每个项目建议准备：

- `cover.jpg`：列表与详情首图，建议 16:9 或 3:2
- `01.jpg`—`06.jpg`：详情过程与结果图
- `preview.mp4`：可选，H.264、静音、适合网页播放
- `poster.jpg`：视频加载前封面

## 2. 作品数据

只修改：

```text
src/data/portfolioCategories.ts
```

复制现有项目对象后，填写：

- `id` / `slug`
- `titleZh` / `titleEn`
- `year`
- `roleZh` / `roleEn`
- `tools`
- `services`
- `summary`
- `cover`
- `gallery`
- `externalUrl`

分类列表、项目详情、静态路径和 GitHub Pages 构建会共用这份数据。

## 3. 合作品牌

品牌 Logo 建议使用透明 PNG 或 WebP，存入：

```text
public/media/brands/
```

然后在 `src/data/profile.ts` 的 `partnerBrands` 中新增真实品牌。当前数组为空，因此网站只显示留白说明，不会出现虚构 Logo。

## 4. 个人平台链接

在 `src/data/profile.ts` 的 `platformLinks` 中补充 `href`。没有 `href` 的项目会保持“链接待补”状态且不可点击。

## 5. 个人介绍

个人姓名、简介、方向标签和头像路径统一位于：

```text
src/data/profile.ts
```

替换头像时保持文件路径不变即可不改组件：

```text
public/media/about/profile.jpg
```
