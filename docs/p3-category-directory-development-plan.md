# BEIMU P3｜四分类目录后续开发计划

## 1. 开发目标

在现有全屏首页之后建立第二个虚拟 Stage，集中展示四个作品大类，并完成从首页、分类目录到分类作品列表的完整访问路径。

四个分类保持统一顺序：

1. 3D 场景
2. AI 开发
3. 3D 产品动画
4. 新媒体视频运营

本轮目标不是增加更多装饰，而是完成一条清晰、稳定、可部署的核心路径：

`首页身份展示 → 下滑进入四分类目录 → 点击完整分类窗口 → 分类作品列表`

## 2. 已完成基线

### P3.1｜统一数据源

- 已建立 `src/data/portfolioCategories.ts`
- 首页导航、第二模块和分类页将共用同一份分类数据
- V212 已确认归入 3D 产品动画
- 新媒体视频运营保持真实的素材待补状态

### P3.2｜顶部边缘导航

- 已建立 `EdgeRevealNav`
- 支持完整、顶部边缘两种状态
- 支持鼠标触碰展开、600ms 延迟收起
- 支持键盘聚焦保持和移动端点击控制
- P3.3 只需要把 `compact` 与 `activeStage` 连接

## 3. 确定的页面架构

主页继续采用单视口双 Stage，不建立真实的第二屏文档滚动。

```text
HomeStage
├── Shared EdgeRevealNav
├── Stage 00 / PortfolioStage
│   ├── BackgroundMedia
│   └── IdentityBlock
└── Stage 01 / CategoryDirectory
    ├── CategoryCard / 3D 场景
    ├── CategoryCard / AI 开发
    ├── CategoryCard / 3D 产品动画
    └── CategoryCard / 新媒体视频运营
```

核心状态：

- `activeStage: 0 | 1`
- `activeCategoryId: PortfolioCategoryId`
- `isStageTransitioning: boolean`
- `transitionDirection: "forward" | "backward"`

`EdgeRevealNav` 移到两个 Stage 的共享层：

- `activeStage === 0`：完整显示
- `activeStage === 1`：自动收起为顶部边缘

非当前 Stage 使用 `inert` 和 `aria-hidden`，避免视觉上隐藏的链接仍能被点击或键盘聚焦。

## 4. P3.3｜主页 Stage 与四分类目录

### 4.1 HomeStage 状态控制

新增：

- `src/components/home/HomeStage.tsx`
- `src/hooks/useStageNavigation.ts`

输入方式：

- 鼠标滚轮向下：Stage 00 → Stage 01
- 鼠标滚轮向上：Stage 01 → Stage 00
- 触摸向上滑：Stage 00 → Stage 01
- 触摸向下滑：Stage 01 → Stage 00
- `PageDown`、`ArrowDown`：进入目录
- `PageUp`、`ArrowUp`：返回首页
- `Home`：返回 Stage 00
- `End`：进入 Stage 01

控制规则：

- 滚轮累计阈值约 48px，避免触控板轻微抖动误切换
- 触摸垂直移动达到约 48px 后才触发
- 横向手势优先交给移动端分类滑动，不触发 Stage 切换
- 切换过程中锁定约 900ms，避免快速连续切换
- `prefers-reduced-motion: reduce` 下取消位移和缩放，只保留短淡入淡出

### 4.2 Stage 切换视觉

推荐时长：

- Stage 离场：约 700ms
- Stage 入场：约 850ms
- 总交互锁定：约 900ms

视觉规则：

- 首页向上移动约 8%—12%，同时轻微模糊和淡出
- 分类目录从下方进入，不使用大幅弹跳
- 透明玻璃导航独立于 Stage，不跟随内容一起飞出
- 动画曲线统一使用 `cubic-bezier(0.16, 1, 0.3, 1)`

### 4.3 CategoryDirectory 桌面结构

新增：

- `src/components/home/CategoryDirectory.tsx`
- `src/components/home/CategoryCard.tsx`
- `src/components/home/CategoryPreviewMedia.tsx`

桌面端使用 2 × 2 全屏网格：

- 默认四格比例为 `1fr / 1fr`
- 当前悬停格所在行列调整为约 `1.08fr / 0.92fr`
- 其余窗口只降低亮度，不做夸张缩小
- 分类编号和名称始终显示
- 英文名称、描述和进入提示在悬停或聚焦时出现
- 完整卡片使用单一 `<Link>`，卡片内部不再嵌套第二个按钮

四格素材：

- 3D 场景：科幻场景视频，方舟封面作为加载与失败回退
- AI 开发：dBsource 与 Yuyakang 预览；初始使用第一条
- 3D 产品动画：V212 视频
- 新媒体视频运营：使用克制的中性空状态，并显示“案例素材整理中”，不伪造项目

视频规则：

- 只允许当前悬停、聚焦或移动端当前卡片播放
- 离开后立即暂停，不在后台继续解码
- 非当前视频使用 poster 和 `preload="metadata"`
- 视频加载失败时保留封面，不显示浏览器破损图标

### 4.4 CategoryDirectory 移动端结构

- 目录内部使用横向滚动，不使用 2 × 2 小格
- 单卡宽度约 `82vw`—`86vw`
- 下一张保留约 10%—14% 露边
- 使用 `scroll-snap-type: x mandatory`
- 分类名称、编号和进入提示在未悬停时也可见
- 当前卡由 Intersection Observer 或滚动中心位置确定
- 横向滑动分类时不触发主页 Stage 返回
- 顶部边缘导航通过点击把手展开，不依赖 hover

### 4.5 P3.3 临时分类路由外壳

为避免目录卡点击后出现 404，P3.3 同步建立最小分类页外壳：

- `src/app/works/[category]/page.tsx`
- `generateStaticParams()` 返回四个分类 slug
- 页面暂时只展示分类名称、返回入口和“作品列表建设中”状态
- P3.5 在该外壳上继续开发正式作品列表

## 5. P3.4｜分类窗口全屏跳转动画

新增：

- `src/components/transitions/CategoryTransitionProvider.tsx`
- `src/components/transitions/CategoryTransitionOverlay.tsx`
- `src/lib/categoryTransition.ts`

交互顺序：

1. 用户点击分类卡完整区域
2. 读取卡片 `getBoundingClientRect()`
3. 锁定重复点击和 Stage 手势
4. 建立与卡片位置一致的固定覆盖层
5. 当前卡扩张到全屏，其他卡淡出
6. 分类标题移动到分类页标题位置
7. 执行路由切换
8. 新页面作品列表分批出现
9. 转场结束后恢复键盘焦点和页面交互

实现策略：

- CSS 固定覆盖层是稳定的基础方案
- 支持时使用 View Transition API 增强连续性
- 不支持 View Transition API 时仍正常跳转
- 开启减少动画时跳过尺寸扩张，只保留 120ms—180ms 淡入淡出
- 转场期间使用状态锁，快速连续点击只执行第一次

## 6. P3.5｜分类作品列表

### 6.1 数据扩展

扩展 `PortfolioProject`：

- `year`
- `roleZh` / `roleEn`
- `tools`
- `services`
- `gallery`
- `detailStatus`
- `externalUrl`

没有确认的信息不填写虚构内容，界面隐藏对应字段。

### 6.2 分类列表版式

方向：电影档案馆式大图列表。

- 顶部显示分类编号、中英文名称和简短介绍
- 桌面端采用大图与项目资料双栏错位结构
- 项目之间保留较大黑色留白
- 图片或视频占主要视觉面积
- 完整项目卡可点击
- AI 项目先进入站内案例说明，再提供外部网站链接
- 新媒体项目先进入站内案例说明，再提供账号主页链接
- 空分类显示明确的待补状态，不生成假项目

### 6.3 首批列表内容

3D 场景：

- 方舟 ARK-7
- 科幻场景

AI 开发：

- dBsource Pro
- Yuyakang

3D 产品动画：

- 产品动画 V212

新媒体视频运营：

- 等待用户提供真实账号预览、账号名称和主页链接

## 7. P3.6｜性能、无障碍与部署验收

### 7.1 性能

- 首页与目录合计同时最多播放一个视频
- 离开 Stage 后暂停该 Stage 的全部视频
- poster 优先显示，视频准备完成后再淡入
- 不在 P3.3 引入 GSAP、Framer Motion 或 Three.js
- 首次实现使用 React 状态与 CSS transition
- 只有 CSS 无法稳定完成 P3.4 时，才评估增加小型动画依赖

### 7.2 无障碍

- 两个 Stage 中只有当前层可以接收焦点
- 所有分类卡均保持链接语义
- `Enter` 可进入分类页
- `focus-visible` 与 hover 拥有同等信息量
- 所有触摸目标至少 24 × 24 CSS px
- 减少动画模式关闭非必要位移、缩放和视差
- 不使用只靠颜色表达当前分类的状态

### 7.3 响应式检查尺寸

- 桌面：1440 × 900、1280 × 720
- 平板：1024 × 768、768 × 1024
- 手机：390 × 844、360 × 800

### 7.4 功能异常检查

- 快速滚轮与触控板连续输入
- 快速重复点击分类卡
- 视频自动播放被浏览器阻止
- 视频文件加载失败
- 从分类页返回首页
- GitHub Pages `/BEIMU` base path
- 微信和手机浏览器无 hover 情况

### 7.5 构建检查

- 源码 lint
- TypeScript
- Next.js 生产构建
- GitHub Pages 静态导出
- 四个分类路径全部生成
- Sites 构建兼容检查

## 8. 开发提交与确认节点

### 节点 A｜P3.3 Stage 基础

- 完成 HomeStage 与输入状态机
- EdgeRevealNav 与 activeStage 连接
- 暂不加入复杂分类视觉
- 单独提交并验证切换稳定性

### 节点 B｜P3.3 四分类目录

- 完成桌面 2 × 2 与移动端横向滑动
- 完成单视频播放控制和新媒体空状态
- 生成第一个可审阅视觉版本
- 用户确认比例、文字位置和悬停幅度

### 节点 C｜P3.4 跳转动画

- 完成全卡点击、锁定、扩张与路由衔接
- 用户确认动画速度和镜头感

### 节点 D｜P3.5 分类作品列表

- 完成通用分类页与首批真实项目
- 用户补充缺失的项目年份、职责、工具和新媒体账号素材

### 节点 E｜P3.6 最终验收

- 完成响应式、键盘、减少动画和异常测试
- 完成 GitHub Pages 与 Sites 构建检查
- 确认后再推送或发布

## 9. 预计工作量

- Stage 状态机与共享导航重构：2—3 小时
- 四分类目录桌面与移动端：4—6 小时
- 全屏跳转动画：4—6 小时
- 分类作品列表：5—8 小时
- 性能、无障碍与部署检查：3—5 小时

总计约 18—28 小时。素材补充、动画视觉返工和新媒体案例整理不包含在该估算内。

## 10. 开发前仍需补充的内容

不阻塞 P3.3：

- V212 正式项目名称
- 每个项目的年份、职责和工具
- 方舟项目是否展示 GGAC 外部链接

会阻塞新媒体分类正式完成：

- 新媒体账号名称
- 账号主页链接
- 账号预览视频或封面
- 可以公开展示的数据与运营成果

## 11. 本轮明确不做

- 不制作虚构的新媒体案例
- 不接入 CMS 或后台
- 不制作新的 AI 图片
- 不重做第一模块主体视觉
- 不开发 About、Contact 和简历模块
- 不一次性引入 GSAP、Framer Motion、Lenis、Three.js
- 不在用户确认前推送正式分支或发布生产版本

## 12. 技术依据

- Next.js `<Link>` 对进入视口的静态路由执行预取，分类卡保留原生链接语义。
- 动态分类路由通过 `generateStaticParams` 在构建时生成四条静态路径。
- 非当前 Stage 使用 `inert`，从点击、Tab 顺序和辅助技术中移除隐藏内容。
- View Transition API 仅作为增强能力，并保留 CSS 与普通导航回退。
- 所有交互动画响应 `prefers-reduced-motion`。

参考：

- [Next.js Linking and Navigating](https://nextjs.org/docs/app/getting-started/linking-and-navigating)
- [MDN inert attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert)
- [MDN View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using)
- [W3C Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
