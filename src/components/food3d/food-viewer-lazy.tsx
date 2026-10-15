"use client";

import dynamic from "next/dynamic";
import type { CatalogItem } from "@/data/catalog";

const Viewer = dynamic(() => import("./food-viewer"), {
  ssr: false,
  loading: () => (
    <div className="grid h-[460px] place-items-center bg-[#12090a] text-sm text-white/60">
      Loading 3D kitchen…
    </div>
  ),
});

export function FoodViewerLazy(props: {
  item: CatalogItem;
  className?: string;
  height?: number;
  compact?: boolean;
  controls?: boolean;
  exploded?: boolean;
  hiddenIds?: string[];
  resetSignal?: number;
}) {
  return <Viewer {...props} />;
}
