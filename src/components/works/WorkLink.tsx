"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useRouteTransition } from "@/components/transitions/RouteTransitionProvider";

export function WorkLink({ href, title, children, className }: {
  href: string; title: string; children: ReactNode; className?: string;
}) {
  const { isTransitioning, startRouteTransition } = useRouteTransition();
  return (
    <Link href={href} className={className} onClick={(event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey ||
        event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (!isTransitioning) startRouteTransition(href, { title });
    }}>{children}</Link>
  );
}
