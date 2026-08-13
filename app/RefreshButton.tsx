"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RefreshButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClick() {
    setLoading(true);
    try {
      await fetch("/api/prices/refresh", { method: "POST" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="rounded-md border border-black/10 dark:border-white/20 px-4 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-50"
    >
      {loading ? "Refreshing…" : "Refresh prices"}
    </button>
  );
}
