/** Dispatched when site nav targets the same URL (Next may no-op push). */
export const SITE_NAV_EVENT = "beimu:site-nav";

export type SiteNavEventDetail = {
  href: string;
};

export type SiteNavId =
  | "home"
  | "about"
  | "works"
  | "download"
  | "contact";

/** Home stages match GlobalTopNav order: 首页→介绍→作品→下载→联系 */
export type HomeStageQuery = "0" | "1" | "2" | "3" | "4";

export type SiteNavItem = {
  id: SiteNavId;
  label: string;
  labelShort: string;
  href: string;
};

/** Site-wide primary navigation — one stage per item on `/`. */
export const siteNavItems: SiteNavItem[] = [
  {
    id: "home",
    label: "首页",
    labelShort: "首页",
    href: "/?stage=0",
  },
  {
    id: "works",
    label: "案例展示",
    labelShort: "案例展示",
    href: "/?stage=2",
  },
  {
    id: "contact",
    label: "关于与联系",
    labelShort: "关于与联系",
    href: "/?stage=4",
  },
];

export function parseHomeStageQuery(
  value: string | null,
): 0 | 1 | 2 | 3 | 4 | null {
  if (
    value === "0" ||
    value === "1" ||
    value === "2" ||
    value === "3" ||
    value === "4"
  ) {
    return Number(value) as 0 | 1 | 2 | 3 | 4;
  }
  return null;
}

export function resolveActiveSiteNavId(
  pathname: string,
  stage: string | null,
): SiteNavId {
  if (pathname.startsWith("/download")) {
    return "download";
  }

  if (pathname.startsWith("/works")) {
    return "works";
  }

  if (pathname === "/" || pathname === "") {
    const homeStage = parseHomeStageQuery(stage);
    if (homeStage === 1) return "contact";
    if (homeStage === 2) return "works";
    if (homeStage === 3) return "contact";
    if (homeStage === 4) return "contact";
    return "home";
  }

  return "home";
}
