# Metallic Paint 本地实验

2026-11-01。分支 codex/visual-lab-metallic。此前案例改动保留，本轮只新增实验相关文件。未提交、推送或部署。

预览：http://localhost:3000/visual-lab ，npm run dev 持续运行。

来源：React Bits main 的 ts-default/Animations/MetallicPaint，附带原 CSS、LICENSE.md 及本地适配说明。无新依赖，package 与锁文件未变。现有 SVG、首页、作品数据、正式导航均未修改。

钴蓝 #0203CC 以 25% 染色强度与银铬混合，慢速流动；一个居中品牌材质装置。SVG CSS 蒙版提供静态后备。系统减少动态效果直接使用静态图，页面隐藏暂停动态。WebGL2 不支持或丢失时显示后备。

检查：新增文件 ESLint、TypeScript 通过；原生生产构建、Pages、Sites 构建通过。全仓 lint 原有首页 3 个错误、3 个警告，未声称全仓通过。Chromium 检查通过：实际金属画布渲染、390/1440px 无横向溢出、WebGL 不可用及上下文丢失后备、减少动态效果静态显示。截图已人工查看。

生产 next start 在临时端口 3002 实测 /visual-lab HTTP 404，响应不含实验文案；临时服务器已停止。生产导出只生成不可展示实验的 not-found 内容。

边界：未做 iPhone/微信真机 GPU 与帧率验收；WebGL2、着色器与设备性能存在差异，静态后备保证可见。默认开发地址使用 localhost，127.0.0.1 在默认启动下可能触发 Next 开发源检查，测试统一使用 localhost。
