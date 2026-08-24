import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/noto-sans-sc";
import "./globals.css";
import "../styles/p5.css";
import "../styles/route-transition.css";
import { RouteTransitionProvider } from "@/components/transitions/RouteTransitionProvider";

export const metadata: Metadata = {
  title: "郑荣成 — BEIMU",
  description: "郑荣成的 3D 建模、AI 开发与新媒体视频运营作品集。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#03070a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <a className="skip-link" href="#main-content">
          跳到主要内容
        </a>
        <RouteTransitionProvider>{children}</RouteTransitionProvider>
      </body>
    </html>
  );
}
