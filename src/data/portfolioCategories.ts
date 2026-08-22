export type PortfolioCategoryId =
  | "3d-scene"
  | "ai-development"
  | "3d-product-motion"
  | "new-media";

export type PortfolioContentStatus = "ready" | "awaiting-asset";

export type PortfolioPreview = {
  id: string;
  kind: "video";
  src: string;
  poster: string;
  objectPosition?: string;
};

export type PortfolioProject = {
  id: string;
  slug: string;
  titleZh: string;
  titleEn: string;
  year?: string;
  summary: string;
  cover: string;
  externalUrl?: string;
};

export type PortfolioCategory = {
  id: PortfolioCategoryId;
  index: string;
  labelZh: string;
  labelEn: string;
  slug: string;
  route: `/works/${string}`;
  description: string;
  contentStatus: PortfolioContentStatus;
  previewMedia: PortfolioPreview[];
  projects: PortfolioProject[];
};

const assetBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const portfolioAssetPath = (path: string) => `${assetBasePath}${path}`;

export const portfolioCategories: PortfolioCategory[] = [
  {
    id: "3d-scene",
    index: "01",
    labelZh: "3D 场景",
    labelEn: "3D Environments",
    slug: "3d-scene",
    route: "/works/3d-scene",
    description: "以空间、光影与叙事构建具有电影感的三维世界。",
    contentStatus: "ready",
    previewMedia: [
      {
        id: "3d-cyberpunk",
        kind: "video",
        src: portfolioAssetPath("/media/3d/3d-cyberpunk.mp4"),
        poster: portfolioAssetPath("/media/3d/3d-cyberpunk-poster.jpg"),
        objectPosition: "center center",
      },
    ],
    projects: [
      {
        id: "ark-7",
        slug: "ark-7",
        titleZh: "方舟",
        titleEn: "ARK-7",
        summary: "科幻概念场景与文明方舟世界观设计。",
        cover: portfolioAssetPath("/media/works/3d-scene/ark/cover.jpg"),
      },
      {
        id: "sci-fi-scene",
        slug: "sci-fi-scene",
        titleZh: "科幻场景",
        titleEn: "Sci-Fi Environment",
        summary: "通过动态镜头呈现空间氛围与环境叙事。",
        cover: portfolioAssetPath("/media/3d/3d-cyberpunk-poster.jpg"),
      },
    ],
  },
  {
    id: "ai-development",
    index: "02",
    labelZh: "AI 开发",
    labelEn: "AI Development",
    slug: "ai-development",
    route: "/works/ai-development",
    description: "从产品结构到可用界面，完成 AI 网站与数字产品开发。",
    contentStatus: "ready",
    previewMedia: [
      {
        id: "dbsource-preview",
        kind: "video",
        src: portfolioAssetPath("/media/ai/dbsource-preview.mp4"),
        poster: portfolioAssetPath("/media/ai/dbsource-preview-poster.jpg"),
        objectPosition: "center top",
      },
      {
        id: "yuyakang-preview",
        kind: "video",
        src: portfolioAssetPath("/media/ai/yuyakang-preview.mp4"),
        poster: portfolioAssetPath("/media/ai/yuyakang-preview-poster.jpg"),
        objectPosition: "center top",
      },
    ],
    projects: [
      {
        id: "dbsource-pro",
        slug: "dbsource-pro",
        titleZh: "dBsource Pro",
        titleEn: "dBsource Pro",
        summary: "AI 网站产品设计与开发案例。",
        cover: portfolioAssetPath("/media/ai/dbsource-preview-poster.jpg"),
        externalUrl: "https://www.dbsource-pro.com/",
      },
      {
        id: "yuyakang",
        slug: "yuyakang",
        titleZh: "Yuyakang",
        titleEn: "Yuyakang",
        summary: "网站产品设计与开发案例。",
        cover: portfolioAssetPath("/media/ai/yuyakang-preview-poster.jpg"),
        externalUrl: "https://www.yuyakang.top/",
      },
    ],
  },
  {
    id: "3d-product-motion",
    index: "03",
    labelZh: "3D 产品动画",
    labelEn: "3D Product Motion",
    slug: "3d-product-motion",
    route: "/works/3d-product-motion",
    description: "以建模、材质、灯光和动态镜头呈现产品价值。",
    contentStatus: "ready",
    previewMedia: [
      {
        id: "product-v212",
        kind: "video",
        src: portfolioAssetPath(
          "/media/3d-product-motion/product-v212.mp4",
        ),
        poster: portfolioAssetPath(
          "/media/3d-product-motion/product-v212-poster.jpg",
        ),
        objectPosition: "center center",
      },
    ],
    projects: [
      {
        id: "product-v212",
        slug: "product-v212",
        titleZh: "产品动画 V212",
        titleEn: "Product Motion V212",
        summary: "以产品展示为核心的三维动态影像。",
        cover: portfolioAssetPath(
          "/media/3d-product-motion/product-v212-poster.jpg",
        ),
      },
    ],
  },
  {
    id: "new-media",
    index: "04",
    labelZh: "新媒体视频运营",
    labelEn: "New Media Operations",
    slug: "new-media",
    route: "/works/new-media",
    description: "账号内容策划、短视频制作与运营案例。",
    contentStatus: "awaiting-asset",
    previewMedia: [],
    projects: [],
  },
];

export const portfolioCategoryById = Object.fromEntries(
  portfolioCategories.map((category) => [category.id, category]),
) as Record<PortfolioCategoryId, PortfolioCategory>;
