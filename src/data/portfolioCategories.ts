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

export type PortfolioProjectBodyBlock = {
  title?: string;
  paragraphs: string[];
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
  /** Optional long-form copy for detail page (text-first projects). */
  bodyZh?: PortfolioProjectBodyBlock[];
  /** Optional muted ~3s clip for list / homepage hover preview. */
  teaser?: string;
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
        src: portfolioAssetPath(
          "/media/works/3d-scene/sci-fi-scene/preview.mp4",
        ),
        poster: portfolioAssetPath(
          "/media/works/3d-scene/sci-fi-scene/poster.jpg",
        ),
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
        coverPosition: "center center",
        detailStatus: "ready",
        gallery: [
          ...Array.from({ length: 11 }, (_, index) => {
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
        id: "ice-lock-cold-river",
        slug: "ice-lock-cold-river",
        titleZh: "冰锁寒川",
        titleEn: "Ice Lock Cold River",
        year: "2023",
        roleZh: "3D 场景与视觉叙事",
        roleEn: "3D Environment & Visual Narrative",
        services: ["概念场景", "巨兽雕塑", "冰雪场域"],
        summary:
          "古老冰川构筑的天然牢狱，禁锢远古巨兽；极寒封印下，洪荒之力仍在搏动。",
        bodyZh: [
          {
            paragraphs: [
              "2125年，赤瞳巨兽“厄迦”引发海啸瘟疫，文明倾覆。人类以“极寒星链”冻结其血脉，冰雕仍在北极海渊。百年后冰川轰鸣如碑，猩红触须仍在冰壳下搏动。",
              "古老冰川构筑的天然牢狱禁锢着远古巨兽“厄喀德娜之嗣”。破碎冰晶环绕的悬空岛屿群形成多重封印矩阵，消融的冰河如银链穿透冰川裂隙，见证着被冻结的时间与等待苏醒的洪荒之力。",
            ],
          },
          {
            title: "视觉设计亮点",
            paragraphs: [],
          },
          {
            title: "巨兽雕塑",
            paragraphs: [
              "采用Blender雕刻模块打造异形生物解剖结构，鳞甲与冰层交融处通过顶点色绘制半透明渐变效果。",
            ],
          },
          {
            title: "冰川生态场域",
            paragraphs: [
              "主岛采用置换修改器生成万年冰层沉积纹理，配合体积散射营造3.6米厚冰体的透光质感。",
              "环绕浮岛群通过资产库实现差异化迭代，每座岛屿承载独特冰蚀地貌与矿物脉络。",
            ],
          },
          {
            title: "创作溯源",
            paragraphs: [
              "灵感来源于北欧神话“芬布尔之冬”与地质纪年学说碰撞，试图用数字艺术语言探讨文明与自然力量的永恒博弈。那些刺破冰层的生物棘刺，既是禁锢的锁链，亦是新纪元的萌芽。",
            ],
          },
          {
            title: "结语",
            paragraphs: [
              "当观看者与冰封巨兽的黄金瞳对视时，能同时感受到零下60℃的极寒，与地核深处传来的炽热脉动——这正是Blender赋予三维艺术的矛盾美学魅力。",
            ],
          },
        ],
        cover: portfolioAssetPath(
          "/media/works/3d-scene/ice-lock-cold-river/cover.jpg",
        ),
        coverPosition: "center center",
        detailStatus: "ready",
        externalUrl: "https://www.bilibili.com/video/BV1BPZzYdEDh/",
        gallery: [
          ...Array.from({ length: 12 }, (_, index) => {
            const number = String(index + 1).padStart(2, "0");
            return {
              id: `ice-lock-${number}`,
              kind: "image" as const,
              src: portfolioAssetPath(
                `/media/works/3d-scene/ice-lock-cold-river/${number}.jpg`,
              ),
              alt: `冰锁寒川 制作图 ${number}`,
            };
          }),
        ],
      },
      {
        id: "alien-star",
        slug: "alien-star",
        titleZh: "异星",
        titleEn: "Alien Star",
        year: "2024",
        roleZh: "3D 场景与视觉叙事",
        roleEn: "3D Environment & Visual Narrative",
        services: ["概念场景", "世界观视觉", "环境叙事"],
        summary:
          "2090年，神秘有机肉球高悬夜空，精神波动引发地球生命疯狂变异。",
        bodyZh: [
          {
            paragraphs: [
              "2090 年，那个神秘的有机肉球高悬在夜空中，仿佛一个邪恶的主宰，散发着令人胆寒的精神波动。",
              "地球上的生命在这种诡异的影响下，开始了疯狂的变异。人类陷入了前所未有的恐慌之中。曾经繁华的城市变成了一片混乱的战场，变异生物四处横行，攻击着一切未被控制的生命。",
              "科学家们紧急集结，试图找出对抗有机肉球精神控制的方法。他们日夜钻研，分析着肉球发出的信号，希望能找到其弱点。然而，每一次的尝试都以失败告终，肉球的力量似乎无法阻挡。",
              "随着时间的推移，被控制的变异生物越来越多，它们组成庞大的军团，向人类最后的据点发起冲击。人类的防线岌岌可危，绝望的情绪在人群中蔓延。",
            ],
          },
        ],
        cover: portfolioAssetPath("/media/works/3d-scene/alien-star/cover.jpg"),
        coverPosition: "center center",
        detailStatus: "ready",
        externalUrl: "https://www.bilibili.com/video/BV1uiiRYeEqW/",
        gallery: [
          ...Array.from({ length: 7 }, (_, index) => {
            const number = String(index + 1).padStart(2, "0");
            return {
              id: `alien-star-${number}`,
              kind: "image" as const,
              src: portfolioAssetPath(
                `/media/works/3d-scene/alien-star/${number}.jpg`,
              ),
              alt: `异星 制作图 ${number}`,
            };
          }),
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
        src: portfolioAssetPath(
          "/media/works/ai-development/dbsource-pro/preview.mp4",
        ),
        poster: portfolioAssetPath(
          "/media/works/ai-development/dbsource-pro/poster.jpg",
        ),
        objectPosition: "center top",
      },
      {
        id: "yuyakang-preview",
        kind: "video",
        src: portfolioAssetPath(
          "/media/works/ai-development/yuyakang/preview.mp4",
        ),
        poster: portfolioAssetPath(
          "/media/works/ai-development/yuyakang/poster.jpg",
        ),
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
        cover: portfolioAssetPath(
          "/media/works/ai-development/dbsource-pro/poster.jpg",
        ),
        detailStatus: "summary",
        gallery: [
          {
            id: "dbsource-website-preview",
            kind: "video",
            src: portfolioAssetPath(
              "/media/works/ai-development/dbsource-pro/preview.mp4",
            ),
            poster: portfolioAssetPath(
              "/media/works/ai-development/dbsource-pro/poster.jpg",
            ),
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
        cover: portfolioAssetPath(
          "/media/works/ai-development/yuyakang/poster.jpg",
        ),
        detailStatus: "summary",
        gallery: [
          {
            id: "yuyakang-website-preview",
            kind: "video",
            src: portfolioAssetPath(
              "/media/works/ai-development/yuyakang/preview.mp4",
            ),
            poster: portfolioAssetPath(
              "/media/works/ai-development/yuyakang/poster.jpg",
            ),
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
          "/media/works/3d-product-motion/product-v212/preview.mp4",
        ),
        poster: portfolioAssetPath(
          "/media/works/3d-product-motion/product-v212/poster.jpg",
        ),
        objectPosition: "center center",
      },
      {
        id: "solo-c",
        kind: "video",
        src: portfolioAssetPath(
          "/media/works/3d-product-motion/solo-c/preview.mp4",
        ),
        poster: portfolioAssetPath(
          "/media/works/3d-product-motion/solo-c/poster.jpg",
        ),
        objectPosition: "center center",
      },
      {
        id: "k212s",
        kind: "video",
        src: portfolioAssetPath(
          "/media/works/3d-product-motion/k212s/preview.mp4",
        ),
        poster: portfolioAssetPath(
          "/media/works/3d-product-motion/k212s/poster.jpg",
        ),
        objectPosition: "center center",
      },
    ],
    projects: [
      {
        id: "product-v212",
        slug: "product-v212",
        titleZh: "V212",
        titleEn: "V212",
        roleZh: "3D 产品动画",
        roleEn: "3D Product Motion",
        services: ["产品表现", "材质灯光", "动态镜头"],
        summary: "V212 产品三维动态展示。",
        cover: portfolioAssetPath(
          "/media/works/3d-product-motion/product-v212/poster.jpg",
        ),
        coverPosition: "center center",
        detailStatus: "summary",
        gallery: [
          {
            id: "product-v212-film",
            kind: "video",
            src: portfolioAssetPath(
              "/media/works/3d-product-motion/product-v212/preview.mp4",
            ),
            poster: portfolioAssetPath(
              "/media/works/3d-product-motion/product-v212/poster.jpg",
            ),
            alt: "V212 预览",
          },
        ],
      },
      {
        id: "solo-c",
        slug: "solo-c",
        titleZh: "SOLO C",
        titleEn: "SOLO C",
        roleZh: "3D 产品动画",
        roleEn: "3D Product Motion",
        services: ["产品表现", "材质灯光", "动态镜头"],
        summary: "SOLO C 产品三维动态展示。",
        cover: portfolioAssetPath(
          "/media/works/3d-product-motion/solo-c/poster.jpg",
        ),
        coverPosition: "center center",
        detailStatus: "summary",
        gallery: [
          {
            id: "solo-c-film",
            kind: "video",
            src: portfolioAssetPath(
              "/media/works/3d-product-motion/solo-c/preview.mp4",
            ),
            poster: portfolioAssetPath(
              "/media/works/3d-product-motion/solo-c/poster.jpg",
            ),
            alt: "SOLO C 预览",
          },
        ],
      },
      {
        id: "k212s",
        slug: "k212s",
        titleZh: "K212S",
        titleEn: "K212S",
        roleZh: "3D 产品动画",
        roleEn: "3D Product Motion",
        services: ["产品表现", "材质灯光", "动态镜头"],
        summary: "K212S 产品三维动态展示。",
        cover: portfolioAssetPath(
          "/media/works/3d-product-motion/k212s/poster.jpg",
        ),
        coverPosition: "center center",
        detailStatus: "summary",
        gallery: [
          {
            id: "k212s-film",
            kind: "video",
            src: portfolioAssetPath(
              "/media/works/3d-product-motion/k212s/preview.mp4",
            ),
            poster: portfolioAssetPath(
              "/media/works/3d-product-motion/k212s/poster.jpg",
            ),
            alt: "K212S 预览",
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
    contentStatus: "ready",
    previewMedia: [
      {
        id: "206m-teaser",
        kind: "video",
        src: portfolioAssetPath("/media/works/new-media/206m/teaser.mp4"),
        poster: portfolioAssetPath("/media/works/new-media/206m/poster.jpg"),
        objectPosition: "center center",
      },
      {
        id: "v212-shoot-teaser",
        kind: "video",
        src: portfolioAssetPath("/media/works/new-media/v212-shoot/teaser.mp4"),
        poster: portfolioAssetPath(
          "/media/works/new-media/v212-shoot/poster.jpg",
        ),
        objectPosition: "center center",
      },
    ],
    projects: [
      {
        id: "206m-product-intro",
        slug: "206m-product-intro",
        titleZh: "206M 产品介绍",
        titleEn: "206M Product Intro",
        roleZh: "视频参与制作",
        roleEn: "Video Production Collaboration",
        services: ["产品介绍", "短视频", "参与制作"],
        summary: "小型返送音箱 206M 产品介绍视频，最大声压级 116dB。",
        bodyZh: [
          {
            paragraphs: [
              "206M 小型返送音箱产品介绍视频，参与制作。最大声压级 116dB。",
              "左侧可预览前 3 秒；完整成片也可在抖音观看。",
            ],
          },
        ],
        teaser: portfolioAssetPath("/media/works/new-media/206m/teaser.mp4"),
        cover: portfolioAssetPath("/media/works/new-media/206m/poster.jpg"),
        detailStatus: "summary",
        gallery: [
          {
            id: "206m-film",
            kind: "video",
            src: portfolioAssetPath("/media/works/new-media/206m/preview.mp4"),
            poster: portfolioAssetPath("/media/works/new-media/206m/poster.jpg"),
            alt: "206M 产品介绍视频",
          },
        ],
        externalUrl: "https://v.douyin.com/pR706P114SA/",
      },
      {
        id: "v212-product-shoot",
        slug: "v212-product-shoot",
        titleZh: "V212 新产品视频",
        titleEn: "V212 Product Video",
        roleZh: "拍摄与剪辑参与制作",
        roleEn: "Shoot & Edit Collaboration",
        services: ["产品拍摄", "剪辑", "参与制作"],
        summary: "V212 双十二三分频线阵列音响系统，拍摄与剪辑参与制作。",
        bodyZh: [
          {
            paragraphs: [
              "V212 双十二三分频线阵列音响系统新产品视频，拍摄与剪辑参与制作。",
              "左侧可预览前 3 秒；完整成片也可在抖音观看。",
            ],
          },
        ],
        teaser: portfolioAssetPath(
          "/media/works/new-media/v212-shoot/teaser.mp4",
        ),
        cover: portfolioAssetPath(
          "/media/works/new-media/v212-shoot/poster.jpg",
        ),
        detailStatus: "summary",
        gallery: [
          {
            id: "v212-shoot-film",
            kind: "video",
            src: portfolioAssetPath(
              "/media/works/new-media/v212-shoot/preview.mp4",
            ),
            poster: portfolioAssetPath(
              "/media/works/new-media/v212-shoot/poster.jpg",
            ),
            alt: "V212 新产品视频",
          },
        ],
        externalUrl: "https://v.douyin.com/HOA5hRCTg4g/",
      },
    ],
  },
];

export const portfolioCategoryById = Object.fromEntries(
  portfolioCategories.map((category) => [category.id, category]),
) as Record<PortfolioCategoryId, PortfolioCategory>;
