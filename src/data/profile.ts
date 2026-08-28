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

export type ProfileBioBlock = {
  kicker?: string;
  paragraphs: string[];
};

export type ProfileLang = "zh" | "en";

export type ProfileCredential = {
  id: string;
  titleZh: string;
  titleEn: string;
  issuerZh: string;
  issuerEn: string;
  year?: string;
  verifyUrl?: string;
};

export const partnerBrands: PartnerBrand[] = [];

export const profileCredentials: ProfileCredential[] = [
  {
    id: "3d-animator-l4",
    titleZh: "四级三维动画师",
    titleEn: "Level 4 3D Animator",
    issuerZh: "国家职业资格 / 3D ANIMATION",
    issuerEn: "National Vocational Qualification / 3D ANIMATION",
  },
  {
    id: "davinci-resolve-20",
    titleZh: "DaVinci Resolve 20",
    titleEn: "DaVinci Resolve 20",
    issuerZh: "BLACKMAGIC DESIGN · CERTIFIED USER",
    issuerEn: "BLACKMAGIC DESIGN · CERTIFIED USER",
  },
  {
    id: "davinci-resolve-18",
    titleZh: "DaVinci Resolve 18",
    titleEn: "DaVinci Resolve 18",
    issuerZh: "BLACKMAGIC DESIGN · TRAINING & CERTIFICATION",
    issuerEn: "BLACKMAGIC DESIGN · TRAINING & CERTIFICATION",
  },
  {
    id: "photoshop-acp",
    titleZh: "Photoshop 专业认证",
    titleEn: "Photoshop Professional Certification",
    issuerZh: "Adobe Certified Professional",
    issuerEn: "Adobe Certified Professional",
  },
];

export const CREDENTIAL_SLOT_COUNT = 4;

export const publicProfile = {
  nameZh: "郑荣成",
  nameEn: "ZHENG RONGCHENG",
  alias: "LEON",
  studioName: "BEIMU",
  studioNameZh: "琲木",
  title: "Multidisciplinary Creator · 3D / AI / MOTION",
  introductionZh: [
    {
      kicker: "WHO I AM",
      paragraphs: [
        "郑荣成（LEON），来自广东东莞，专注于 3D 场景、AI 开发、视觉设计、产品动效与影像内容。以真实项目为核心，从概念、视觉、制作到最终交付，持续建立跨越设计与技术的完整创作能力。",
      ],
    },
    {
      kicker: "WHY BEIMU",
      paragraphs: [
        "BEIMU / 琲木 是我的个人创意品牌。它建立在两种力量之间：自然生长与精确塑形，Organic × Precision。我希望不被单一媒介定义，而是让 3D、AI、Motion 与影像成为不同的表达工具，最终形成清晰、克制且具有辨识度的视觉语言。",
        "工具会变化，判断与表达不会。我关注的不只是“如何完成”，更是如何把一个想法转化为真正可被看见、使用和记住的作品。",
      ],
    },
  ] satisfies ProfileBioBlock[],
  introductionEn: [
    {
      kicker: "WHO I AM",
      paragraphs: [
        "Zheng Rongcheng (LEON) is a multidisciplinary creator based in Dongguan, China, working across 3D environments, AI development, visual design, product motion and image-making.",
        "His practice is grounded in real projects and end-to-end production — turning ideas into clear, functional and visually distinctive outcomes across design and technology.",
      ],
    },
    {
      kicker: "WHY BEIMU",
      paragraphs: [
        "BEIMU is his independent creative identity, built around the relationship between Organic × Precision — natural growth shaped through structure and control. Rather than being defined by a single medium, BEIMU treats 3D, AI, motion and image as tools for building one coherent visual language.",
        "Tools change. Vision remains.",
      ],
    },
  ] satisfies ProfileBioBlock[],
  location: "DONGGUAN · CHINA",
  portrait: "/media/about/profile.jpg",
  disciplines: ["3D 场景", "AI 开发", "视觉设计", "产品动效", "影像内容"],
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
