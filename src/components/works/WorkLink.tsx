"use client";

import type { ReactNode } from "react";
import { useRouteTransition } from "@/components/transitions/RouteTransitionProvider";
import { portfolioAssetPath } from "@/data/portfolioCategories";
import { needsDocumentNavigation } from "@/lib/documentNavigation";

export function WorkLink({ href, title, children, className }: {
  href: string; title: string; children: ReactNode; className?: string;
}) {
  const { isTransitioning, startRouteTransition } = useRouteTransition();
  return (
    <a href={portfolioAssetPath(href)} className={className} onClick={(event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey ||
        event.ctrlKey || event.shiftKey || event.altKey) return;
      if (needsDocumentNavigation(navigator.userAgent, window.matchMedia("(pointer: coarse)").matches)) return;
      event.preventDefault();
      if (!isTransitioning) startRouteTransition(href, { title });
    }}>{children}</a>
  );
}
