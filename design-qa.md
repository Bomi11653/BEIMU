# Design QA — P1 首页

## Result

Passed

## Visual target

- 方案 2 视觉稿。
- 全屏 3D 场景背景、顶部细长玻璃分段栏、左下姓名与品牌、底部年份和地点。

## Verification

- 桌面检查视口：1363 × 936。
- 参考图与实际页面在同一轮视觉输入中并排比较。
- 页面无横向或纵向溢出。
- 视频成功自动播放，检查时 `readyState = 4`。
- 三项能力导航均为原生 radio control；点击后 checked 状态正确切换。
- Next.js 生产构建、TypeScript 和 ESLint 检查通过。

## Adjustments made after comparison

- 上移玻璃导航并保持约 82vw 的视觉宽度。
- 放大姓名并将身份区左边距对齐到视觉稿约 7vw 的位置。
- 将 `PORTFOLIO 2026` 回正到页面中轴。
- 将地点右边距与身份区形成对称关系。
- 降低底部遮罩模糊的起始高度，保留中景细节。
- 移除背景的低饱和处理，使真实视频更接近参考稿的青蓝/霓虹色密度。

## Known P1 boundary

- 当前仅默认播放 3D 视频；三分类视频切换、自动轮播和项目外链按计划进入 P2/P3。
- 当前 3D 素材带平台水印，正式上线前建议替换为无水印原始导出。
