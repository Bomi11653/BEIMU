"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { brandAssets } from "@/data/brand";
import { portfolioAssetPath } from "@/data/portfolioCategories";
import {
  SITE_NAV_EVENT,
  resolveActiveSiteNavId,
  siteNavItems,
  type SiteNavEventDetail,
  type SiteNavId,
} from "@/data/siteNav";

export function GlobalTopNav() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [navActiveId, setNavActiveId] = useState<SiteNavId | null>(null);

  useEffect(() => {
    setNavActiveId(
      resolveActiveSiteNavId(pathname, searchParams.get("stage")),
    );
  }, [pathname, searchParams]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const goTo = (href: string) => {
    setMenuOpen(false);

    const current = `${window.location.pathname}${window.location.search}`;
    const targetUrl = new URL(href, window.location.origin);
    const target = `${targetUrl.pathname}${targetUrl.search}`;

    if (current === target || current.replace(/\?$/, "") === target) {
      window.dispatchEvent(
        new CustomEvent<SiteNavEventDetail>(SITE_NAV_EVENT, {
          detail: { href },
        }),
      );
      return;
    }

    router.push(href);
  };

  return (
    <header className="global-top-nav">
      <div className="global-top-nav-bar">
        <Link
          className="global-top-nav-brand"
          href="/?stage=0"
          aria-label="BEIMU 首页"
          onClick={(event) => {
            event.preventDefault();
            goTo("/?stage=0");
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="global-top-nav-brand-mark"
            src={portfolioAssetPath(brandAssets.wordmarkWhite)}
            alt=""
            width={120}
            height={28}
          />
        </Link>

        <nav className="global-top-nav-desktop" aria-label="全站导航">
          <ul className="global-top-nav-list">
            {siteNavItems.map((item) => {
              const isActive = navActiveId === item.id;

              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={
                      isActive
                        ? "global-top-nav-link is-active"
                        : "global-top-nav-link"
                    }
                    aria-current={isActive ? "page" : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      goTo(item.href);
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          className="global-top-nav-toggle"
          type="button"
          aria-controls="global-top-nav-menu"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "关闭菜单" : "打开菜单"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>

      {menuOpen ? (
        <div id="global-top-nav-menu" className="global-top-nav-drawer is-open">
          <nav aria-label="全站导航菜单">
            <ul className="global-top-nav-drawer-list">
              {siteNavItems.map((item) => {
                const isActive = navActiveId === item.id;

                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={
                        isActive
                          ? "global-top-nav-drawer-link is-active"
                          : "global-top-nav-drawer-link"
                      }
                      aria-current={isActive ? "page" : undefined}
                      onClick={(event) => {
                        event.preventDefault();
                        goTo(item.href);
                      }}
                    >
                      {item.labelShort}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
