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
  logo: string;
  kind: "external" | "email" | "wechat";
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
    id: "bilibili",
    label: "Bilibili",
    handle: "UID 279855573",
    logo: "/media/contact/logos/bilibili.svg",
    kind: "external",
    href: "https://space.bilibili.com/279855573",
  },
  {
    id: "xiaohongshu",
    label: "小红书",
    handle: "LEON",
    logo: "/media/contact/logos/xiaohongshu.svg",
    kind: "external",
    href: "https://www.xiaohongshu.com/user/profile/5f966ddd0000000001000622",
  },
  {
    id: "ggac",
    label: "GGAC",
    handle: "UID 674218",
    logo: "/media/contact/ggac-logo.png",
    kind: "external",
    href: "https://www.ggac.com/user-center/home/work/list?uid=674218",
  },
  {
    id: "github",
    label: "GitHub",
    handle: "Bomi11653",
    logo: "/media/contact/logos/github.svg",
    kind: "external",
    href: "https://github.com/Bomi11653",
  },
  {
    id: "wechat",
    label: "微信",
    handle: "LEON",
    logo: "/media/contact/logos/wechat.svg",
    kind: "wechat",
  },
  {
    id: "gmail",
    label: "Gmail",
    handle: "shhsjsasd886@gmail.com",
    logo: "/media/contact/logos/gmail.svg",
    kind: "email",
    href: "mailto:shhsjsasd886@gmail.com",
  },
];
