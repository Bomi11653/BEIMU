import type { Metadata } from "next";
import { DownloadRedirect } from "./DownloadRedirect";

export const metadata: Metadata = {
  title: "下载 — 郑荣成 / BEIMU",
  description: "BEIMU 作品档案与资料下载（位置已预留）。",
};

export default function DownloadPage() {
  return <DownloadRedirect />;
}
