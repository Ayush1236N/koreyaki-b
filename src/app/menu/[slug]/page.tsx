import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getItemBySlug, MENU_ITEMS } from "@/data/catalog";
import { DishBuildView } from "@/components/food3d/dish-build-view";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return MENU_ITEMS.map((item) => ({ slug: item.slug }));
}

export default async function DishMenuPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getItemBySlug(slug);

  if (!item) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0F0F10] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto mb-6 max-w-[1400px]">
        <Link
          href="/#menu"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#B5B5B5] transition hover:text-white"
        >
          <ArrowLeft size={14} /> Back to menu
        </Link>
      </div>

      <DishBuildView item={item} />
    </main>
  );
}
