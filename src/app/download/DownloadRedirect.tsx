"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Legacy `/download` URL → home download stage. */
export function DownloadRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/?stage=3");
  }, [router]);

  return (
    <main
      id="main-content"
      className="download-page"
      data-route-focus
      tabIndex={-1}
      aria-busy="true"
    >
      <section className="download-reserved" aria-labelledby="download-title">
        <p className="download-reserved-kicker">DOWNLOAD / ARCHIVE</p>
        <h1 id="download-title">下载</h1>
        <p className="download-reserved-status">EMPTY · RESERVED</p>
        <p className="download-reserved-copy">正在进入下载页…</p>
      </section>
    </main>
  );
}
