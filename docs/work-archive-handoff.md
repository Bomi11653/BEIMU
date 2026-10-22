# 作品分类更新说明

## 页面关系

首页 `/?stage=2` → 分类列表 `/works/{category}` → 项目详情 `/works/{category}/{project}`。

`/works` 与首页作品模块共用分类索引。每条代表一个分类，不是一个项目。五个方向为平面海报、3D 场景、3D 产品动画、新媒体视频剪辑与 AI 开发。平面分类没有接入真实素材，显示“素材待补充”，点击进入“作品整理中”页面。

## 素材与数据

项目数据位于 `src/data/portfolioCategories.ts`。将新项目素材放入 `public/media/works/{category}/{project}/`，再添加项目数据；仅放入文件不会自动显示。

分类的 `representativeProjectId` 可指定首页代表项目；未设置时使用该分类第一个项目。代表封面读取项目的 `cover`，悬停备用图读取第一个与封面不同的图集图片。分类入口始终链接分类页。

## 后续扩展

新增分类需扩展 `PortfolioCategoryId` 并加入 `portfolioCategories`。分类目录和分类导航自动读取该列表。首页第一阶段的四项能力轮播仍单独由 `src/data/featuredCategories.ts` 管理，不与作品目录的分类数量绑定。

目录布局位于 `src/components/works/CategoryIndex.tsx`，样式位于 `src/styles/work-archive.css`。当前目录没有 Git 元数据，修改未提交。
