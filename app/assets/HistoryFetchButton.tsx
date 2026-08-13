"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const PERIOD_OPTIONS = [
  { label: "1 month", days: 30 },
  { label: "3 months", days: 90 },
  { label: "6 months", days: 180 },
  { label: "1 year", days: 365 },
];

export default function HistoryFetchButton({ assetId }: { assetId: string }) {
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const router = useRouter();

  async function handleClick() {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/prices/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetId, days }),
      });
      const data = await res.json();
      setStatus(res.ok ? `Fetched ${data.daysFetched} days` : data.error);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2 justify-end">
      {status && <span className="text-xs opacity-60">{status}</span>}
      <select
        value={days}
        onChange={(e) => setDays(Number(e.target.value))}
        className="border rounded-md px-1.5 py-1 text-xs border-black/10 dark:border-white/20 bg-transparent"
      >
        {PERIOD_OPTIONS.map((opt) => (
          <option key={opt.days} value={opt.days}>
            {opt.label}
          </option>
        ))}
      </select>
      <button
        onClick={handleClick}
        disabled={loading}
        className="text-xs opacity-60 hover:opacity-100 hover:underline disabled:opacity-30"
      >
        {loading ? "Fetching…" : "Fetch history"}
      </button>
    </div>
  );
}
