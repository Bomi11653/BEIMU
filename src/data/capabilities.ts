export type CapabilityId = "3d" | "ai" | "media";

export type CapabilityMedia = {
  id: string;
  src: string;
  poster: string;
  objectPosition?: string;
};

export type Capability = {
  id: CapabilityId;
  index: string;
  label: string;
  media: CapabilityMedia[];
};

const assetBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const mediaPath = (path: string) => `${assetBasePath}${path}`;

export const capabilities: Capability[] = [
  {
    id: "3d",
    index: "01",
    label: "3D 建模项目",
    media: [
      {
        id: "3d-cyberpunk",
        src: mediaPath("/media/3d/3d-cyberpunk.mp4"),
        poster: mediaPath("/media/3d/3d-cyberpunk-poster.jpg"),
        objectPosition: "center center",
      },
    ],
  },
  {
    id: "ai",
    index: "02",
    label: "AI 开发项目",
    media: [
      {
        id: "dbsource-preview",
        src: mediaPath("/media/ai/dbsource-preview.mp4"),
        poster: mediaPath("/media/ai/dbsource-preview-poster.jpg"),
        objectPosition: "center top",
      },
      {
        id: "yuyakang-preview",
        src: mediaPath("/media/ai/yuyakang-preview.mp4"),
        poster: mediaPath("/media/ai/yuyakang-preview-poster.jpg"),
        objectPosition: "center top",
      },
    ],
  },
  {
    id: "media",
    index: "03",
    label: "新媒体视频运营师",
    media: [
      {
        id: "product-v212",
        src: mediaPath("/media/media/product-v212.mp4"),
        poster: mediaPath("/media/media/product-v212-poster.jpg"),
        objectPosition: "center center",
      },
    ],
  },
];
