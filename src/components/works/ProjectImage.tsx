"use client";

import { useRef, useState } from "react";

export function ProjectImage({ src, thumbnailSrc, alt, eager = false, objectPosition, dismissOnTap = false }: {
  src: string; thumbnailSrc?: string; alt: string; eager?: boolean; objectPosition?: string; dismissOnTap?: boolean;
}) {
  const gesture = useRef({ x: 0, y: 0, moved: false });
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  return (
    <>
      <button type="button" className="project-image-trigger" aria-label={`放大查看：${alt}`} aria-haspopup="dialog" onClick={() => {
        if (typeof dialog.current?.showModal !== "function") {
          window.location.assign(src);
          return;
        }
        setOpen(true);
        dialog.current?.showModal();
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumbnailSrc ?? src} alt={alt} decoding="async" loading={eager ? "eager" : "lazy"} style={{ objectPosition }} />
        <span className="project-image-hint">点击放大 ↗</span>
      </button>
      <dialog ref={dialog} className="project-image-dialog" aria-label={`图片查看：${alt}`} onClose={() => {
        setOpen(false);
        setZoomed(false);
      }} onClick={(event) => {
        if (event.target === event.currentTarget) dialog.current?.close();
      }}>
        <div className="project-image-toolbar">
          <span>{alt}</span>
          <button type="button" aria-pressed={zoomed} onClick={() => setZoomed(!zoomed)}>{zoomed ? "适应屏幕" : "原图尺寸"}</button>
          <button type="button" autoFocus onClick={() => dialog.current?.close()}>关闭 ×</button>
        </div>
        <div className="project-image-canvas" data-zoomed={zoomed} key={String(zoomed)}
          onPointerDown={(event) => {
            gesture.current = { x: event.clientX, y: event.clientY, moved: !event.isPrimary };
          }}
          onPointerMove={(event) => {
            if (Math.hypot(event.clientX - gesture.current.x, event.clientY - gesture.current.y) > 8) gesture.current.moved = true;
          }}
          onPointerCancel={() => { gesture.current.moved = true; }}
          onClick={() => { if (dismissOnTap && !gesture.current.moved) dialog.current?.close(); }}>
          {open ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={alt} />
          ) : null}
        </div>
      </dialog>
    </>
  );
}
