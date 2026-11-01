# STEP 02 字体实验

## V2 全屏构图（2026-11-01）

原路由升级：BUILDING 引导词 + 三行巨型标题，宽度分别按网格错位，字体尺寸通过 ResizeObserver 和字体加载后测量适配。桌面最宽标题约占视口 85%，主体排版区约占视口 80%；手机独立设置行宽与纵向字形比例，完整保留单词。

新增 KineticComposition.tsx；修改 TypeLab.tsx、type-lab.css、scripts/test-type-lab.mjs。没有新增依赖，官方 SplitText、STEP 01 与正式页面未变。

统一 GSAP 时间线：引导词入场；三个主标题相隔 .16 秒，从遮罩下方以不同位移、倾斜和时长进入；约 2.43 秒归位；入场结束后鼠标视差最大数像素，离开回位。使用 useGSAP scope、revertOnUpdate 和 matchMedia 清理。系统减少动态效果时显示完整静态构图。

浏览器检查：320×740、390×844、768×900（窄预览替代尺寸）、1440×900，无横向溢出，实际标题边界完整；重播、鼠标视差与回位、实时减少动态效果切换通过。390 与 1440 完整截图已查看。窄尺寸为模拟，未读取 Codex 内嵌窗口的实际尺寸；手机测试为 Chromium 触摸模拟。

2026-11-01。本地地址：http://localhost:3000/visual-lab/type。

黑底白字，BUILDING / WORLDS / SYSTEMS / STORIES 四行依次上移显现，间隔 0.22 秒，单行时长 0.9 秒，无循环。按钮重新挂载动画以重播。系统减少动态效果时显示静态文字并禁用重播，支持运行时偏好变化。

源码采用 React Bits 官方 ts-default/TextAnimations/SplitText，保留许可证与来源说明。安装 gsap 3.15.0、@gsap/react 2.1.2，仅字体实验引用。未改变 Metallic Paint、首页、作品与品牌 SVG。

新增：src/app/visual-lab/type/page.tsx、src/components/visual-lab/TypeLab.tsx、type-lab.css、vendor/SplitText.tsx、vendor/SplitText-SOURCE.md、scripts/test-type-lab.mjs 和本报告。修改 package.json、package-lock.json。

验证：TypeScript、新增文件 ESLint 通过；build:pages、build:sites、build:vercel 通过。生产 next start 下 /visual-lab/type 返回 404，临时生产服务器已停止。全仓 lint 仍有首页既存 3 个错误和 3 个警告。

Chromium 自动检查：四个单词拆分、重播后显示、320/390/768/1440px 无横向溢出、运行时开启减少动态效果后无拆分节点且文字完整。已查看桌面截图；未做微信或 iOS 真机验收。

保留本地开发服务器。不提交、不推送、不部署；停在 STEP 02 视觉验收。
