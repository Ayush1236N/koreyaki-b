"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Maximize2,
  Check,
  ShoppingBag,
} from "lucide-react";
import { FoodViewerLazy } from "./food-viewer-lazy";
import { formatInrFromPaise, type CatalogItem } from "@/data/catalog";
import { defaultSelections, priceCustomizedItem } from "@/lib/pricing";
import { useCart } from "@/store/cart-store";

export function DishBuildView({
  item,
  isModal = false,
  onClose,
}: {
  item: CatalogItem;
  isModal?: boolean;
  onClose?: () => void;
}) {
  const router = useRouter();
  const add = useCart((s) => s.add);

  const [qty, setQty] = useState(1);
  const [selections, setSelections] = useState(() => defaultSelections(item.groups));
  const [activeStep, setActiveStep] = useState<number>(item.asset.components.length);
  const [exploded, setExploded] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [resetNonce, setResetNonce] = useState(0);

  const components = item.asset.components;
  const totalComponents = components.length;
  const addedComponents = Math.min(activeStep, totalComponents);

  const priced = useMemo(() => priceCustomizedItem(item, selections, qty), [item, selections, qty]);
  const adjustmentsPaise = priced.unitPaise - priced.basePaise;

  const hiddenComponentIds = useMemo(() => {
    return components.slice(activeStep).map((c) => c.id);
  }, [components, activeStep]);

  const nextComponent = activeStep < totalComponents ? components[activeStep] : null;

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  const handleAddToCart = () => {
    add({ itemId: item.id, quantity: qty, selections, notes: "" });
    setFeedback("Added to your order draft!");
    setTimeout(() => setFeedback(""), 2500);
  };

  const handleReset = () => {
    setSelections(defaultSelections(item.groups));
    setActiveStep(totalComponents);
    setQty(1);
    setExploded(false);
    setResetNonce((n) => n + 1);
  };

  return (
    <div className="relative mx-auto flex w-full max-w-[1400px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#161213] text-[#f6efe6] shadow-2xl lg:flex-row">
      {/* LEFT PANE: PHOTO + PLATE CONFIGURATOR */}
      <div className="flex w-full flex-col border-b border-white/10 lg:w-1/2 lg:border-b-0 lg:border-r">
        {/* Photo header */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-black sm:aspect-[16/9]">
          <Image
            src={item.image}
            alt={item.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161213] via-transparent to-black/30" />

          {/* Preview pricing pill */}
          <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-white/20 bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#161213] shadow-md backdrop-blur">
            <Sparkles size={12} className="text-[#E31C23]" />
            Preview pricing
          </div>

          <div className="absolute bottom-3 left-4 right-4">
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/60">
              {item.category} / Configure Your Plate
            </p>
          </div>
        </div>

        {/* Content details */}
        <div className="flex flex-1 flex-col p-6 sm:p-8">
          <h1 className="font-display text-4xl sm:text-5xl">{item.name}</h1>
          <p className="mt-3 text-sm leading-relaxed text-white/70">{item.description}</p>

          {/* Component pills */}
          <div className="mt-4 flex flex-wrap gap-2">
            {components.map((c) => (
              <span
                key={c.id}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80"
              >
                {c.label}
              </span>
            ))}
          </div>

          {/* "Make it yours" header */}
          <div className="mt-8 flex items-center justify-between border-b border-white/10 pb-2">
            <h2 className="font-display text-xl font-medium">Make it yours</h2>
            <span className="text-[10px] uppercase tracking-[0.18em] text-white/40">
              Available options
            </span>
          </div>

          {/* Customization Groups */}
          {item.groups.length > 0 ? (
            <div className="mt-4 space-y-4">
              {item.groups.map((group) => (
                <div key={group.id} className="rounded-lg border border-white/10 p-3.5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#E31C23]">
                    {group.name}
                  </p>
                  {group.helper && (
                    <p className="mt-1 text-xs text-white/50">{group.helper}</p>
                  )}
                  <div className="mt-2 space-y-2">
                    {group.options.map((opt) => (
                      <label
                        key={opt.id}
                        className="flex cursor-pointer items-center justify-between text-sm text-white/85"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={group.id}
                            checked={selections[group.id] === opt.id}
                            onChange={() =>
                              setSelections((s) => ({ ...s, [group.id]: opt.id }))
                            }
                            className="accent-[#E31C23]"
                          />
                          <span>{opt.label}</span>
                        </div>
                        <span className="text-xs text-white/50">
                          {opt.pricePaise > 0
                            ? `+${formatInrFromPaise(opt.pricePaise)}`
                            : "Included"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-xs italic text-white/40">
              Authentic recipe with verified ingredients. Add special kitchen notes at cart checkout.
            </p>
          )}

          {/* Pricing summary columns */}
          <div className="mt-8 grid grid-cols-3 gap-2 border-y border-white/10 py-4 text-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/50">Base</p>
              <p className="mt-1 text-base font-semibold">
                {formatInrFromPaise(priced.basePaise)}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/50">Adjustments</p>
              <p className="mt-1 text-base font-semibold">
                {formatInrFromPaise(adjustmentsPaise * qty)}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/50">Preview total</p>
              <p className="font-display mt-1 text-2xl font-bold text-[#E31C23]">
                {formatInrFromPaise(priced.linePaise)}
              </p>
            </div>
          </div>

          {/* Stepper + Add to Cart Button */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Quantity stepper */}
            <div
              className="flex h-12 w-full items-center justify-between rounded-lg border border-white/20 bg-black/40 px-3 sm:w-36"
              aria-label="Quantity"
            >
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid h-8 w-8 place-items-center text-white/70 hover:text-white"
                aria-label="Decrease quantity"
              >
                <Minus size={15} />
              </button>
              <span className="text-base font-semibold">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(20, q + 1))}
                className="grid h-8 w-8 place-items-center text-white/70 hover:text-white"
                aria-label="Increase quantity"
              >
                <Plus size={15} />
              </button>
            </div>

            {/* Red Add to Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-[#E31C23] px-6 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#c8161c]"
            >
              <ShoppingBag size={15} />
              ADD TO CART · {formatInrFromPaise(priced.linePaise)} ↗
            </button>
          </div>

          {feedback && (
            <p className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400">
              <Check size={14} /> {feedback}
            </p>
          )}

          {/* Reset link */}
          <div className="mt-4 flex items-center justify-between text-xs text-white/50">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 text-[#E31C23] hover:underline"
            >
              Reset options <RotateCcw size={12} />
            </button>
            <span className="text-[11px] text-white/40">
              {item.available ? "● In kitchen today" : "○ Currently unavailable"}
            </span>
          </div>

          <p className="mt-4 text-[11px] leading-relaxed text-white/40">
            ⓘ Final availability and pricing are confirmed by Koreyaki at order handoff.
          </p>
        </div>
      </div>

      {/* RIGHT PANE: BUILD VIEW & 3D INTERACTIVE */}
      <div className="relative flex min-h-[500px] w-full flex-col bg-[#0f0c0d] lg:w-1/2">
        {/* Header bar of Build View */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <Maximize2 size={13} className="text-[#E31C23]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/80">
              BUILD VIEW · {item.name}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/60">
              <span
                className={`h-2 w-2 rounded-full ${
                  addedComponents === totalComponents ? "bg-emerald-400" : "bg-amber-400"
                }`}
              />
              {addedComponents}/{totalComponents} components added
            </span>
            <button
              type="button"
              onClick={handleClose}
              className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Close build view"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* 3D Canvas Viewport */}
        <div className="relative flex-1">
          {/* Decorative glowing concentric rings from screenshot */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40">
            <div className="h-72 w-72 rounded-full border border-amber-500/20 shadow-[0_0_80px_rgba(227,28,35,0.15)]" />
            <div className="absolute h-96 w-96 rounded-full border border-red-500/10" />
            <div className="absolute h-[480px] w-56 -rotate-45 rounded-[100%] border border-amber-400/15" />
          </div>

          <FoodViewerLazy
            item={item}
            height={440}
            controls={false}
            exploded={exploded}
            hiddenIds={hiddenComponentIds}
            resetSignal={resetNonce}
          />

          {/* Component layer callout overlays */}
          <div className="pointer-events-none absolute left-6 top-8 space-y-2 text-[10px] uppercase tracking-[0.18em]">
            {components.map((c, idx) => (
              <div
                key={c.id}
                className={`transition-opacity ${
                  idx < activeStep ? "text-white/80 opacity-100" : "text-white/25 opacity-40"
                }`}
              >
                <span className="font-mono text-[#E31C23]">
                  {String(idx + 1).padStart(2, "0")} ·
                </span>{" "}
                {c.label}
              </div>
            ))}
          </div>
        </div>

        {/* Footer controls matching screenshots */}
        <div className="border-t border-white/10 bg-black/60 p-4 backdrop-blur">
          <div className="mb-3 text-center text-[10px] uppercase tracking-[0.24em] text-white/50">
            DRAG TO ROTATE ·{" "}
            {addedComponents === totalComponents
              ? "ALL COMPONENTS ADDED"
              : "START WITH THE FIRST COMPONENT"}
          </div>

          {/* Action button to add next layer if building step by step */}
          {nextComponent ? (
            <div className="mb-3 flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-2 px-3">
              <span className="text-xs uppercase tracking-wider text-white/60">
                NEXT: {nextComponent.label}
              </span>
              <button
                type="button"
                onClick={() => setActiveStep((s) => Math.min(totalComponents, s + 1))}
                className="rounded-md bg-[#E31C23] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#c8161c]"
              >
                ADD {nextComponent.label} +
              </button>
            </div>
          ) : null}

          {/* Interactive controls bar from screenshots */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
              disabled={activeStep <= 0}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white/70 hover:text-white disabled:opacity-30"
              aria-label="Previous component"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              type="button"
              onClick={() => setExploded((v) => !v)}
              className="rounded-full border border-[#E31C23] px-5 py-2 text-xs font-medium uppercase tracking-[0.16em] text-white hover:bg-[#E31C23]/20"
            >
              {exploded ? "Assemble dish" : "Explode dish"}
            </button>

            <button
              type="button"
              onClick={() => setActiveStep((s) => Math.min(totalComponents, s + 1))}
              disabled={activeStep >= totalComponents}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white/70 hover:text-white disabled:opacity-30"
              aria-label="Next component"
            >
              <ChevronRight size={16} />
            </button>

            <button
              type="button"
              onClick={() => setActiveStep(totalComponents)}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white/70 hover:text-white"
              title="Add all"
              aria-label="Add all components"
            >
              <Plus size={14} />
            </button>

            <button
              type="button"
              onClick={() => setActiveStep(0)}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white/70 hover:text-white"
              title="Remove all"
              aria-label="Remove all components"
            >
              <Minus size={14} />
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white/70 hover:text-white"
              title="Reset view"
              aria-label="Reset build view"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          {/* Component status trail */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[10px] tracking-wider text-white/50">
            {components.map((c, i) => (
              <span key={c.id} className={i < activeStep ? "text-[#E31C23]" : "text-white/30"}>
                {String(i + 1).padStart(2, "0")} {c.label}
                {i < activeStep ? " +" : ""}
              </span>
            ))}
          </div>

          <p className="mt-2 text-center text-[10px] text-white/40">
            ⓘ Selecting a dish resets its build. Add components one by one to preview the assembly.
          </p>
          <p className="mt-2 text-center text-[10px] leading-relaxed text-white/45">
            <span className="text-[#E31C23]">{item.asset.status.replace("MODEL_", "").replace("_", " ")}</span>
            {item.asset.notes ? ` · ${item.asset.notes}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
