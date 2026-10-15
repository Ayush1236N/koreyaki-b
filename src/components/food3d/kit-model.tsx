"use client";

import { Html, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { CatalogItem } from "@/data/catalog";
import { MODEL_REGISTRY, type KitEntry, type KitPiece } from "@/data/model-registry";

/** How far each role travels when exploded (multiplied by the dish's size). */
const ROLE_LIFT: Record<string, number> = {
  vessel: -0.35,
  base: -0.05,
  serving: -0.3,
  primary: 0.2,
  topping: 0.55,
  garnish: 0.65,
};

const HIGHLIGHT = new THREE.Color("#E31C23");
const BLACK = new THREE.Color("#000000");
const TARGET_HEIGHT = 2.2;

export type BuiltComponent = {
  id: string;
  label: string;
  object: THREE.Group;
  /** component centre in model space (before normalisation) */
  center: THREE.Vector3;
  /** offset applied when exploded, in model space */
  explode: THREE.Vector3;
  /** height above the centre where the label sits */
  labelY: number;
};

export type BuiltKit = {
  components: BuiltComponent[];
  scale: number;
  offset: THREE.Vector3;
};

function findNodes(root: THREE.Object3D, name: string): THREE.Object3D[] {
  const out: THREE.Object3D[] = [];
  root.traverse((o) => {
    if (o.name === name) out.push(o);
  });
  return out;
}

/** Copies one real node out of its GLB, with its world transform baked in and its own materials. */
function makePiece(scenes: Map<string, THREE.Object3D>, piece: KitPiece): THREE.Object3D | null {
  const scene = scenes.get(piece.file);
  if (!scene) return null;
  scene.updateMatrixWorld(true);
  const src = findNodes(scene, piece.node)[piece.index ?? 0];
  if (!src) {
    console.warn(`[kit] node not found: ${piece.file} › ${piece.node}`);
    return null;
  }
  const world = src.matrixWorld.clone();
  const obj = src.clone(true);

  if (piece.exclude?.length) {
    const doomed: THREE.Object3D[] = [];
    obj.traverse((o) => {
      if (o !== obj && piece.exclude!.includes(o.name)) doomed.push(o);
    });
    doomed.forEach((o) => o.removeFromParent());
  }

  world.decompose(obj.position, obj.quaternion, obj.scale);
  obj.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (mesh.isMesh) {
      mesh.material = Array.isArray(mesh.material)
        ? mesh.material.map((m) => m.clone())
        : mesh.material.clone();
    }
  });
  return obj;
}

/**
 * Turns a registry entry into positioned, explodable components.
 * Explode direction is derived from each component's real position in the model,
 * so new dishes need only a registry entry, not new viewer code.
 */
export function buildKit(entry: KitEntry, scenes: Map<string, THREE.Object3D>): BuiltKit | null {
  const groups: { id: string; label: string; role: string; group: THREE.Group; center: THREE.Vector3; box: THREE.Box3 }[] = [];

  for (const comp of entry.components) {
    const parts: THREE.Object3D[] = [];
    for (const piece of comp.pieces) {
      const proto = makePiece(scenes, piece);
      if (!proto) continue;
      const copies = Math.max(1, piece.copies ?? 1);
      const size = new THREE.Box3().setFromObject(proto).getSize(new THREE.Vector3());
      const radius = copies > 1 ? Math.max(size.x, size.z) * (0.9 + copies * 0.12) : 0;
      for (let i = 0; i < copies; i++) {
        const o = i === 0 ? proto : proto.clone(true);
        if (copies > 1) {
          const a = (i / copies) * Math.PI * 2 + 0.3;
          o.position.x += Math.cos(a) * radius;
          o.position.z += Math.sin(a) * radius;
        }
        parts.push(o);
      }
    }
    if (!parts.length) continue;

    const group = new THREE.Group();
    parts.forEach((p) => group.add(p));
    group.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(group);
    const center = box.getCenter(new THREE.Vector3());
    // Keep the piece geometry in place, but make the component's own origin its centre.
    parts.forEach((p) => p.position.sub(center));
    group.updateMatrixWorld(true);
    groups.push({ id: comp.id, label: comp.label, role: comp.role, group, center, box });
  }

  if (!groups.length) return null;

  const all = new THREE.Box3();
  groups.forEach((g) => all.union(g.box));
  const M = all.getCenter(new THREE.Vector3());
  const size = all.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const D = maxDim * 0.5;

  const components: BuiltComponent[] = groups.map((g, i) => {
    const dir = new THREE.Vector3(g.center.x - M.x, 0, g.center.z - M.z);
    if (dir.lengthSq() < 1e-4) dir.set(Math.cos(i * 2.4), 0, Math.sin(i * 2.4));
    dir.normalize();
    const lift = ROLE_LIFT[g.role] ?? 0.2;
    const explode = new THREE.Vector3(
      dir.x * D * 0.45,
      (g.center.y - M.y) * 1.1 + lift * D * 1.2,
      dir.z * D * 0.45,
    );
    return {
      id: g.id,
      label: g.label,
      object: g.group,
      center: g.center,
      explode,
      labelY: g.box.max.y - g.center.y + D * 0.12,
    };
  });

  const scale = TARGET_HEIGHT / maxDim;
  return { components, scale, offset: M.clone().multiplyScalar(-scale) };
}

function KitPart({
  comp,
  exploded,
  hidden,
  selected,
  showLabel,
  onSelect,
}: {
  comp: BuiltComponent;
  exploded: boolean;
  hidden: boolean;
  selected: boolean;
  showLabel: boolean;
  onSelect: (id: string) => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const target = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    ref.current?.position.copy(comp.center);
  }, [comp]);

  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    target.copy(comp.center);
    if (exploded) target.add(comp.explode);
    g.position.lerp(target, 1 - Math.exp(-6 * dt));
  });

  useEffect(() => {
    comp.object.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((mat) => {
        const std = mat as THREE.MeshStandardMaterial;
        if (std.emissive) {
          std.emissive.copy(selected ? HIGHLIGHT : BLACK);
          std.emissiveIntensity = selected ? 0.3 : 0;
        }
      });
    });
  }, [comp, selected]);

  return (
    <group
      ref={ref}
      visible={!hidden}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(comp.id);
      }}
    >
      <primitive object={comp.object} />
      {showLabel && !hidden ? (
        <Html position={[0, comp.labelY, 0]} center>
          <button
            type="button"
            onClick={() => onSelect(comp.id)}
            className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] shadow-lg backdrop-blur ${
              selected
                ? "border-[#E31C23] bg-[#E31C23] text-white"
                : "border-white/20 bg-black/75 text-white"
            }`}
          >
            {comp.label}
          </button>
        </Html>
      ) : null}
    </group>
  );
}

/** Loads the real GLB parts for one dish and renders them as separate, selectable components. */
export function KitModel({
  item,
  exploded,
  selectedId,
  hidden,
  onSelect,
}: {
  item: CatalogItem;
  exploded: boolean;
  selectedId: string | null;
  hidden: string[];
  onSelect: (id: string) => void;
}) {
  const entry = MODEL_REGISTRY[item.id];
  const files = useMemo(
    () => Array.from(new Set(entry.components.flatMap((c) => c.pieces.map((p) => p.file)))),
    [entry],
  );
  const filesKey = files.join("|");
  const gltfs = useGLTF(files.map((f) => `/models/kit/${f}`)) as unknown as { scene: THREE.Object3D }[];

  const built = useMemo(() => {
    const scenes = new Map<string, THREE.Object3D>(files.map((f, i) => [f, gltfs[i].scene]));
    return buildKit(entry, scenes);
    // gltfs is cached by drei per URL; filesKey captures its identity for this dish.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry, filesKey]);

  if (!built) return null;

  return (
    <group scale={built.scale} position={[built.offset.x, built.offset.y, built.offset.z]}>
      {built.components.map((c) => (
        <KitPart
          key={c.id}
          comp={c}
          exploded={exploded}
          hidden={hidden.includes(c.id)}
          selected={selectedId === c.id}
          showLabel={exploded || selectedId === c.id}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}
