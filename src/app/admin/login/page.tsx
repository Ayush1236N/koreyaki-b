"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setError("That password is not valid.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }
  return (
    <main className="mx-auto max-w-sm px-4 py-24">
      <h1 className="font-display text-4xl">Staff</h1>
      <p className="mt-2 text-sm text-white/50">Authorized Koreyaki team only.</p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <label className="block text-xs uppercase tracking-[0.16em] text-white/50">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 h-11 w-full border border-white/15 bg-transparent px-3 text-sm"
          />
        </label>
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        <button className="h-11 w-full bg-[#E31C23] text-xs uppercase tracking-[0.16em]">Sign in</button>
      </form>
    </main>
  );
}
