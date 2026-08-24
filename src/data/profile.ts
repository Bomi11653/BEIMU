export type PartnerBrand = {
  id: string;
  name: string;
  logo: string;
  href?: string;
};

export type PlatformLink = {
  id: string;
  label: string;
  handle: string;
  href?: string;
};

export const partnerBrands: PartnerBrand[] = [];

export const publicProfile = {
  nameZh: "郑荣成",
  nameEn: "LEON BEIMU",
  title: "3D · AI · MOTION",
  statement: "用 3D、AI 与动态影像，构建可以被看见和使用的视觉世界。",
  introduction:
    "我关注 3D 场景、AI 产品开发与产品视觉动效，也参与视频内容制作。这个作品集记录我如何把视觉表达、交互设计和可用产品连接起来。",
  location: "DONGGUAN · CHINA",
  portrait: "/media/about/profile.jpg",
  disciplines: ["3D ENVIRONMENT", "AI DEVELOPMENT", "PRODUCT MOTION", "VIDEO CONTENT"],
};

export const platformLinks: PlatformLink[] = [
  {
    id: "github",
    label: "GITHUB",
    handle: "Bomi11653",
    href: "https://github.com/Bomi11653",
  },
  {
    id: "bilibili",
    label: "BILIBILI",
    handle: "链接待补",
  },
  {
    id: "xiaohongshu",
    label: "小红书",
    handle: "链接待补",
  },
  {
    id: "douyin",
    label: "抖音",
    handle: "链接待补",
  },
  {
    id: "email",
    label: "EMAIL",
    handle: "地址待补",
  },
];
