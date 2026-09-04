"use client";

import { useEffect, useRef, type RefObject } from "react";
import { portfolioAssetPath } from "@/data/portfolioCategories";

type WeChatDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
};

export function WeChatDialog({
  isOpen,
  onClose,
  returnFocusRef,
}: WeChatDialogProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
      return;
    }

    if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const closeDialog = () => {
    const dialog = dialogRef.current;
    if (dialog?.open) {
      dialog.close();
      return;
    }
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className="wechat-dialog"
      aria-labelledby="wechat-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        closeDialog();
      }}
      onClose={() => {
        onClose();
        returnFocusRef.current?.focus();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeDialog();
      }}
    >
      <div className="wechat-dialog-panel">
        <header className="wechat-dialog-header">
          <h2 id="wechat-dialog-title">微信 / WECHAT</h2>
          <button
            type="button"
            className="wechat-dialog-close"
            aria-label="关闭微信二维码"
            onClick={closeDialog}
            autoFocus
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <figure className="wechat-dialog-qr">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={portfolioAssetPath("/media/contact/wechat-qr.png")}
            alt="Affectionwood 的微信二维码"
          />
          <figcaption>微信：Affectionwood</figcaption>
        </figure>
      </div>
    </dialog>
  );
}
