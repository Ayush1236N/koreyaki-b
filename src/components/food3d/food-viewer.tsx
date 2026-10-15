"use client";

import { ContactShadows, Html, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useState } from "react";
import type { CatalogItem } from "@/data/catalog";
import { KitModel } from "./kit-model";

export default function FoodViewer({
  item,
  className = "",
  height = 520,
  compact = false,
  controls,
  exploded: exploded_controlled,
  hiddenIds = [],
  resetSignal = 0,
}: {
  item: CatalogItem;
  className?: string;
  height?: number;
  compact?: boolean;
  /** show the built-in toolbar (defaults to true unless compact) */
  controls?: boolean;
  /** when provided, the parent owns the exploded state */
  exploded?: boolean;
  /** components hidden by the parent (e.g. build steps not yet added) */
  hiddenIds?: string[];
  /** bump to reset the camera and clear local selection */
  resetSignal?: number;
}) {
  const [localExploded, setLocalExploded] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [userHidden, setUserHidden] = useState<string[]>([]);
  const [camKey, setCamKey] = useState(0);
  const [webgl, setWebgl] = useState(true);

  const exploded = exploded_controlled ?? localExploded;
  const showControls = controls ?? !compact;
  const hidden = useMemo(
    () => Array.from(new Set([...userHidden, ...hiddenIds])),
    [userHidden, hiddenIds],
  );
  const selected = item.asset.components.find((c) => c.id === selectedId) ?? null;
  const hasModel = item.asset.components.length > 0 && item.asset.status !== "IMAGE_FALLBACK";

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      setWebgl(Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl")));
    } catch {
      setWebgl(false);
    }
  }, []);

  useEffect(() => {
    setSelectedId(null);
    setUserHidden([]);
    setLocalExploded(false);
  }, [item.id]);

  useEffect(() => {
    setSelectedId(null);
    setUserHidden([]);
    setLocalExploded(false);
    setCamKey((k) => k + 1);
  }, [resetSignal]);

  if (!webgl || !hasModel) {
    return (
      <div className={`relative overflow-hidden bg-[#12090a] ${className}`} style={{ height }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
        <p className="absolute bottom-4 left-4 right-4 rounded-lg bg-black/70 px-3 py-2 text-xs text-white">
          3D view is not available on this device or dish. You can still order {item.name} from the menu.
        </p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#12090a] ${className}`}>
      <div style={{ height }} className="w-full">
        <Canvas
          key={`${item.id}-${camKey}`}
          shadows
          dpr={[1, 1.75]}
          camera={{ position: [2.3, 1.9, 2.3], fov: 36 }}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          aria-label={`Interactive 3D model of ${item.name}`}
        >
          <color attach="background" args={["#12090a"]} />
          <hemisphereLight args={["#fff1e0", "#1a0c10", 1.1]} />
          <directionalLight position={[3, 5, 3]} intensity={1.6} castShadow />
          <spotLight position={[-3, 4, -2]} intensity={0.8} color="#7aa2ff" />
          <Suspense
            fallback={
              <Html center>
                <span className="whitespace-nowrap text-xs uppercase tracking-[0.2em] text-white/70">
                  Loading 3D model…
                </span>
              </Html>
            }
          >
            <KitModel
              item={item}
              exploded={exploded}
              selectedId={selectedId}
              hidden={hidden}
              onSelect={(id) => setSelectedId((cur) => (cur === id ? null : id))}
            />
          </Suspense>
          <ContactShadows position={[0, -1.14, 0]} opacity={0.5} scale={6} blur={2.4} far={2.2} />
          <OrbitControls
            makeDefault
            enablePan
            autoRotate={compact && !exploded}
            autoRotateSpeed={0.7}
            minDistance={1.6}
            maxDistance={6}
            minPolarAngle={0.3}
            maxPolarAngle={Math.PI / 2.05}
            target={[0, 0, 0]}
          />
        </Canvas>
      </div>

      <div className="pointer-events-none absolute left-3 top-3 rounded-full border border-white/15 bg-black/55 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/80">
        {item.asset.explodedReady ? "3D · Separate parts" : "3D · Single model"}
      </div>

      {selected ? (
        <div className="pointer-events-none absolute left-3 right-3 top-12 max-w-xs rounded-lg border border-white/15 bg-black/80 p-3 text-xs leading-relaxed text-white/85 shadow-xl">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#E31C23]">{selected.label}</p>
          <p className="mt-1">{selected.info}</p>
        </div>
      ) : null}

      {showControls ? (
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-2">
          {controls === undefined ? (
            <button
              type="button"
              onClick={() => setLocalExploded((v) => !v)}
              disabled={!item.asset.explodedReady}
              className="rounded-full bg-[#E31C23] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white disabled:opacity-40"
            >
              {exploded ? "Assemble dish" : "Explode dish"}
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => {
              setLocalExploded(false);
              setSelectedId(null);
              setUserHidden([]);
              setCamKey((k) => k + 1);
            }}
            className="rounded-full border border-white/20 bg-black/50 px-4 py-2 text-xs uppercase tracking-[0.14em] text-white"
          >
            Reset view
          </button>
          {item.asset.components.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={userHidden.includes(c.id)}
              onClick={() =>
                setUserHidden((h) => (h.includes(c.id) ? h.filter((x) => x !== c.id) : [...h, c.id]))
              }
              className={`rounded-full border px-3 py-2 text-[10px] uppercase tracking-[0.12em] ${
                userHidden.includes(c.id)
                  ? "border-white/10 bg-black/30 text-white/40"
                  : "border-white/20 bg-black/50 text-white"
              }`}
            >
              {userHidden.includes(c.id) ? `Show ${c.label}` : `Hide ${c.label}`}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
