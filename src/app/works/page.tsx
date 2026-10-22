import type { Metadata } from "next";
import { WorkArchive } from "@/components/works/WorkArchive";
import "@/styles/work-archive.css";

export const metadata: Metadata = {
  title: "作品分类 — BEIMU",
  description: "按平面海报、3D 场景、产品动画、新媒体视频和 AI 开发分类浏览 BEIMU 作品。",
};

export default function WorksPage() {
  return <WorkArchive />;
}
