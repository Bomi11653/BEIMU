export type Capability = {
  id: "3d" | "ai" | "media";
  index: string;
  label: string;
};

export const capabilities: Capability[] = [
  { id: "3d", index: "01", label: "3D 建模项目" },
  { id: "ai", index: "02", label: "AI 开发项目" },
  { id: "media", index: "03", label: "新媒体视频运营师" },
];
