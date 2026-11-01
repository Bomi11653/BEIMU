import { notFound } from "next/navigation";
import { TypeLab } from "@/components/visual-lab/TypeLab";

export const metadata = { title: "BEIMU / Type Study 02", robots: { index: false, follow: false } };

export default function TypeLabPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <TypeLab />;
}
