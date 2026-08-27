import { Suspense } from "react";
import { HomeStage } from "@/components/home/HomeStage";

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomeStage />
    </Suspense>
  );
}
