import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-display text-5xl">Page not found</h1>
      <p className="mt-4 text-white/60">That route is not on the Koreyaki site.</p>
      <Link href="/" className="mt-6 inline-block text-[#E31C23]">
        Back home
      </Link>
    </main>
  );
}
