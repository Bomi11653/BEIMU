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

export type PortfolioGalleryItem = {
  id: string;
  kind: "image" | "video";
  src: string;
  alt: string;
  poster?: string;
  objectPosition?: string;
};

export type PortfolioProject = {
  id: string;
  slug: string;
  titleZh: string;
  titleEn: string;
  year?: string;
  roleZh?: string;
  roleEn?: string;
  tools?: string[];
  services?: string[];
  summary: string;
  cover: string;
  coverPosition?: string;
  gallery: PortfolioGalleryItem[];
  detailStatus: "ready" | "summary";
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
        year: "2025",
        roleZh: "3D 场景与视觉叙事",
        roleEn: "3D Environment & Visual Narrative",
        services: ["科幻概念场景", "世界观视觉", "环境叙事"],
        summary:
          "方舟-7 是播种计划下首艘永久家园级文明方舟，以空间结构、电影镜头和世界观文档共同构成完整叙事。",
        cover: portfolioAssetPath("/media/works/3d-scene/ark/cover.jpg"),
        detailStatus: "ready",
        gallery: [
          ...Array.from({ length: 6 }, (_, index) => {
            const number = String(index + 1).padStart(2, "0");
            return {
              id: `ark-${number}`,
              kind: "image" as const,
              src: portfolioAssetPath(
                `/media/works/3d-scene/ark/${number}.jpg`,
              ),
              alt: `方舟 ARK-7 项目展示 ${number}`,
            };
          }),
        ],
      },
      {
        id: "sci-fi-scene",
        slug: "sci-fi-scene",
        titleZh: "科幻场景",
        titleEn: "Sci-Fi Environment",
        year: "2025",
        roleZh: "3D 场景动态展示",
        roleEn: "3D Environment Motion",
        services: ["空间氛围", "灯光表现", "动态镜头"],
        summary: "通过动态镜头呈现空间氛围与环境叙事。",
        cover: portfolioAssetPath("/media/3d/3d-cyberpunk-poster.jpg"),
        detailStatus: "summary",
        gallery: [
          {
            id: "sci-fi-scene-film",
            kind: "video",
            src: portfolioAssetPath("/media/3d/3d-cyberpunk.mp4"),
            poster: portfolioAssetPath("/media/3d/3d-cyberpunk-poster.jpg"),
            alt: "科幻场景动态预览",
          },
        ],
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
        roleZh: "产品设计与网站开发",
        roleEn: "Product Design & Web Development",
        services: ["信息架构", "界面设计", "前端开发"],
        summary: "AI 网站产品设计与开发案例。",
        cover: portfolioAssetPath("/media/ai/dbsource-preview-poster.jpg"),
        detailStatus: "summary",
        gallery: [
          {
            id: "dbsource-website-preview",
            kind: "video",
            src: portfolioAssetPath("/media/ai/dbsource-preview.mp4"),
            poster: portfolioAssetPath("/media/ai/dbsource-preview-poster.jpg"),
            alt: "dBsource Pro 网站预览",
          },
        ],
        externalUrl: "https://www.dbsource-pro.com/",
      },
      {
        id: "yuyakang",
        slug: "yuyakang",
        titleZh: "Yuyakang",
        titleEn: "Yuyakang",
        roleZh: "网站设计与开发",
        roleEn: "Web Design & Development",
        services: ["界面设计", "响应式开发", "网站交付"],
        summary: "网站产品设计与开发案例。",
        cover: portfolioAssetPath("/media/ai/yuyakang-preview-poster.jpg"),
        detailStatus: "summary",
        gallery: [
          {
            id: "yuyakang-website-preview",
            kind: "video",
            src: portfolioAssetPath("/media/ai/yuyakang-preview.mp4"),
            poster: portfolioAssetPath("/media/ai/yuyakang-preview-poster.jpg"),
            alt: "Yuyakang 网站预览",
          },
        ],
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
        roleZh: "3D 产品动画",
        roleEn: "3D Product Motion",
        services: ["产品表现", "材质灯光", "动态镜头"],
        summary: "以产品展示为核心的三维动态影像。",
        cover: portfolioAssetPath(
          "/media/3d-product-motion/product-v212-poster.jpg",
        ),
        detailStatus: "summary",
        gallery: [
          {
            id: "product-v212-film",
            kind: "video",
            src: portfolioAssetPath(
              "/media/3d-product-motion/product-v212.mp4",
            ),
            poster: portfolioAssetPath(
              "/media/3d-product-motion/product-v212-poster.jpg",
            ),
            alt: "产品动画 V212 预览",
          },
        ],
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
