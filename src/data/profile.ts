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
  preview: string;
  action: string;
  href?: string;
};

export const partnerBrands: PartnerBrand[] = [];

export const publicProfile = {
  nameZh: "郑荣成",
  nameEn: "ZHENG RONGCHENG",
  studioName: "BEIMU",
  title: "3D / AI / MOTION",
  introductionZh: [
    "郑荣成，来自广东东莞，专注于 3D 场景、AI 网站开发、3D 产品动画与新媒体视频制作。擅长从概念、视觉设计到最终交付的完整制作流程。",
    "目前持续完善 BEIMU 个人作品体系，以真实项目为核心，结合空间叙事、产品设计与影像表达，建立清晰、可靠且具有辨识度的个人视觉品牌。",
  ],
  introductionEn: [
    "Zheng Rongcheng is a multidisciplinary creator based in Dongguan, working across 3D environments, AI-powered web development, product motion and new media production.",
    "Through BEIMU, he develops a portfolio grounded in real projects, combining spatial storytelling, product design and moving image into a clear and distinctive visual practice.",
  ],
  location: "DONGGUAN · CHINA",
  portrait: "/media/about/profile.jpg",
  disciplines: ["3D 场景", "AI 开发", "视觉影像"],
};

export const platformLinks: PlatformLink[] = [
  {
    id: "email",
    label: "Email",
    handle: "地址待补",
    preview: "/media/contact/email.webp",
    action: "LINK TO ADD",
  },
  {
    id: "github",
    label: "GitHub",
    handle: "Bomi11653",
    preview: "/media/contact/github.webp",
    action: "VIEW PROFILE",
    href: "https://github.com/Bomi11653",
  },
  {
    id: "xiaohongshu",
    label: "小红书",
    handle: "链接待补",
    preview: "/media/contact/xiaohongshu.webp",
    action: "LINK TO ADD",
  },
  {
    id: "wechat",
    label: "微信",
    handle: "二维码待补",
    preview: "/media/contact/wechat.webp",
    action: "QR TO ADD",
  },
  {
    id: "behance",
    label: "Behance",
    handle: "链接待补",
    preview: "/media/contact/behance.webp",
    action: "LINK TO ADD",
  },
];
