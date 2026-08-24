# BEIMU P3｜分类目录与作品入口执行方案

详细开发步骤、组件拆分、验收节点与工作量见 [`p3-category-directory-development-plan.md`](./p3-category-directory-development-plan.md)。

## 目标

在现有全屏作品集首页之后增加一个四分类目录，并延续 BEIMU 的黑色电影感、透明玻璃导航和全屏媒体体验。

四个分类：

1. 3D 场景
2. AI 开发
3. 3D 产品动画
4. 新媒体视频运营

桌面端采用 2 × 2 全屏分类窗口；移动端采用横向滑动窗口。每个分类窗口的完整区域都可以进入对应作品列表。

## 当前基线

- 开发分支：`feature/category-directory-p3`
- 基线来源：GitHub 最新 `origin/main`，提交 `96f8349`
- 本地原有 P1/P2 分支继续保留，不覆盖历史
- 当前技术栈保持 Next.js 16、React 19、TypeScript、Tailwind CSS 4
- 第一阶段不为单一动画额外引入大型运行时依赖

## 已复用资产

### 旧站真实作品素材

来源：`Bomi11653/1111/public/works/blender-ark`

迁移位置：`public/media/works/3d-scene/ark`

- `cover.jpg`
- `01.jpg`—`06.jpg`
- `posters/poster-01.jpg`—`poster-04.jpg`
- 原项目说明 `README.md`

### 旧站个人资产

- `public/about/profile.jpg`
- 迁移为 `public/media/about/profile.jpg`

### 暂不迁移

- 旧简历 PDF：文件较大，并且可能需要更新个人资料
- 占位图和 Next.js 默认 SVG：不属于作品资产
- `冰锁寒川`：旧仓库目录为空，没有可复用的真实媒体

## 旧代码复用策略

### 复用逻辑

- `PageTransitionContext`：复用转场状态机、重复点击锁定、路由时序与减少动画判断
- `transition.ts`：复用点击窗口的位置、尺寸和分类标识数据结构
- `ImmersiveWorksSection`：复用悬停、键盘聚焦、完整区域触发的交互思路
- `HorizontalAccordion`：只复用展开比例与缓动思路

### 不直接复制

- `NavShutterOverlay`：上下闸门视觉与当前 Apple 透明玻璃风格不一致
- `SiteHeader`：只支持滚动后增加模糊，不支持顶部边缘收起
- 旧站的 serif 字体、紫色发光、厚重渐变和嵌套按钮结构

## P3.1｜统一分类数据

新增统一分类数据源，首页导航、第二模块、分类作品页共用同一份数据。

状态：已完成。统一数据源位于 `src/data/portfolioCategories.ts`，首页能力导航已从该数据源派生，后续模块不再重复维护分类与素材路径。

每个分类包含：

- `id`
- `index`
- `labelZh` / `labelEn`
- `slug`
- `previewVideo`
- `poster`
- `description`
- `projects`

建议路由：

- `/works/3d-scene`
- `/works/ai-development`
- `/works/3d-product-motion`
- `/works/new-media`

素材初始映射：

- 3D 场景：现有科幻场景视频 + 方舟 ARK 静帧
- AI 开发：dBsource Pro + Yuyakang 网站预览
- 3D 产品动画：`product-v212.mp4`（已确认归入此分类）
- 新媒体视频运营：需要单独的账号案例预览；当前保持素材待补状态，不使用其他分类作品冒充

## P3.2｜顶部边缘导航

新增 `EdgeRevealNav`：

状态：组件、展开/延迟收起、键盘聚焦保持和移动端点击控制已完成；P3.3 建立第二模块时，将 `compact` 与首页 `activeStage` 直接连接。

- 第一模块完整显示
- 进入第二模块后向顶部收起，只留下 6—8px 玻璃边
- 顶部至少 24px 作为实际鼠标与触摸感应区，6—8px 只负责视觉提示
- 鼠标进入、键盘聚焦或向上操作时展开
- 鼠标离开后延迟约 600ms 收起
- 展开约 520ms，收起约 420ms
- 移动端点击边缘把手展开，不依赖 hover
- 支持 `prefers-reduced-motion`

如果首页采用虚拟 Stage 切换，导航状态直接绑定 `activeStage`，不依赖 `window.scrollY`。

隐藏状态不能遮挡键盘焦点：当导航内部元素获得焦点时，导航必须先完整展开，并保持可见到焦点离开。

## P3.3｜四分类目录

状态：已完成。桌面与移动端均保持 2 × 2 四分类结构、单视频播放与完整卡片链接。

新增 `CategoryDirectory`：

- 桌面端 2 × 2 全屏网格
- 默认四格等宽等高
- 悬停窗口轻微扩大，其他窗口降低亮度
- 只播放当前悬停或聚焦的预览视频
- 编号、分类名始终可见
- 补充说明和进入提示在悬停后出现
- 每个窗口使用单一完整链接，不嵌套第二个链接或按钮
- 支持 Enter、Space、清晰的 `focus-visible` 状态
- 使用 Next.js `<Link>` 作为完整卡片链接，让分类路由可以在进入视口后预取

移动端：

- 单屏横向滑动
- 每张分类窗口约占 82vw
- 保留下一张露边，提示用户可以继续滑动
- 点击进入，不设置只能通过悬停触发的内容

## P3.4｜分类窗口跳转动画

状态：已完成。使用稳定的 CSS 固定覆盖层、重复点击锁和减少动画回退。

新增 `CategoryTransitionProvider`，复用旧站状态机思路，但重做视觉：

1. 记录点击窗口的 `getBoundingClientRect()`
2. 锁定当前媒体画面并阻止重复点击
3. 当前窗口从原位置扩张至全屏
4. 其他三个窗口淡出
5. 分类标题移动到作品列表标题位置
6. 路由切换到对应分类作品页
7. 作品列表分批出现

浏览器支持时使用 View Transition API；其他浏览器回退为 CSS 全屏覆盖层和渐隐，不影响导航。

实现时必须使用功能检测，不能把 View Transition API 作为唯一的导航方式。

## P3.5｜分类作品列表

状态：已完成。四个分类页、五个真实项目详情路径及外部项目入口均已静态生成；新媒体保持待补状态。

建立通用 `/works/[category]` 页面：

- 延续电影档案馆式双栏或大图列表
- 顶部保留四分类导航
- 每项展示项目名、年份、职责和工具
- 项目卡完整区域可点击
- 内部项目进入详情页
- AI 网站案例可进入站内介绍，再提供外部网站链接
- 新媒体项目可进入案例介绍，再提供账号主页链接
- 使用 `generateStaticParams` 生成四个静态分类路径，兼容 GitHub Pages 静态导出

首批内容：

- 3D 场景：方舟 ARK、科幻场景
- AI 开发：dBsource Pro、Yuyakang
- 3D 产品动画：产品动画 V212（归类已确认，正式项目名称后续可调整）
- 新媒体视频运营：待补账号预览与主页链接

## P3.6｜性能与验收

状态：已完成。ESLint、TypeScript、生产构建、9 条作品路径静态生成与 Sites 托管产物检查均已通过。

- 同时最多播放一个分类预览视频
- 其余视频使用 poster 和 `preload="metadata"`
- 检查 GitHub Pages 的 `/BEIMU` base path
- 桌面、平板、手机三档视觉检查
- 键盘导航、焦点顺序和完整卡片链接检查
- `prefers-reduced-motion` 检查
- 快速连续点击、返回页面和视频加载失败检查
- 执行 lint、生产构建和 GitHub Pages 预览

## 网页资料核对后的技术结论

- Next.js 16 的 `<Link>` 会为静态路由执行预取，因此四个分类窗口应直接采用 `<Link>`，不要用普通 `div + router.push` 取代链接语义。
- 动态分类路由应提供 `generateStaticParams`，避免 GitHub Pages 静态导出时缺少分类页面。
- View Transition API 只作为增强效果，并保留普通导航回退。
- 如果后续加入 GSAP Observer，它可以统一处理滚轮、触摸和指针方向；当前阶段仍优先使用现有 React/CSS 结构，确认需要虚拟 Stage 后再增加依赖。
- WCAG 2.2 AA 的指针目标最低要求为 24 × 24 CSS px，因此顶部虽然只显示 6—8px 玻璃边，实际交互热区必须至少 24px。
- 收起导航在键盘聚焦时必须自动展开，保证焦点清晰可见且不被顶部容器遮挡。

参考资料：

- [Next.js Linking and Navigating](https://nextjs.org/docs/app/getting-started/linking-and-navigating)
- [Next.js Link Component](https://nextjs.org/docs/app/api-reference/components/link)
- [MDN View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using)
- [GSAP Observer](https://gsap.com/docs/v3/Plugins/Observer/)
- [W3C Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)
- [W3C Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible)

## 推荐开发顺序

1. P3.1 分类数据与素材映射
2. P3.2 顶部边缘导航
3. P3.3 四分类目录结构
4. P3.4 全屏跳转动画
5. P3.5 分类作品列表
6. P3.6 响应式、无障碍、性能和部署验收

每个阶段单独提交，确认视觉与交互后再进入下一阶段。
