import { notFound } from "next/navigation";
import { MetallicBrandLab } from "@/components/visual-lab/MetallicBrandLab";

export const metadata = {
  title: "BEIMU / Material Study 01",
  robots: { index: false, follow: false },
};

export default function VisualLabPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <MetallicBrandLab />;
}
