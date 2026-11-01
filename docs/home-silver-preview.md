# 首页银色符号本地方案

2026-11-01。用户授权从实验进入本地首页视觉修改；手机流畅度作为下一项集中处理，不声称完成。

访问 http://localhost:3000/?stage=0 ，片头完成或跳过后可见。

PortfolioStage.tsx：仅 NODE_ENV=development 启用 is-silver-preview 与动态导入 HomeSilverMark。原有五阶段与片头逻辑保留。HomeSilverMark.tsx 引用原 Metallic Paint，不改 STEP 01。home-silver-preview.css 对首页背景层施加 30px 模糊与边缘扩展、35%压暗；前景银色符号，姓名与专业方向改在底部两侧。

静态蒙版后备；减少动态效果时静态展示；切离首页卸载金属实例。原品牌 SVG 不变，无新依赖。生产模式不启用首页视觉变更，不提交、不推送、不部署。

验证：TypeScript、新增组件 ESLint、Chromium 中实际金属画布渲染与计算样式 blur(30px) 通过；390与1440宽度截图已查看并修复手机文字定位。浏览器脚本模拟视频播放被阻止，截图用于构图检查，不代表真实视频播放/帧率验收。

已知：此前手机背景视频仍沿用海报后备策略，手机视频恢复与触摸、滚动性能优化尚未实施；本轮不声称已解决。原有首页 Hooks lint 错误保留。
