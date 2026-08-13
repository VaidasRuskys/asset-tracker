import { prisma } from "@/lib/prisma";
import { createHolding, deleteHolding } from "./actions";

export const dynamic = "force-dynamic";

export default async function HoldingsPage() {
  const [holdings, assets] = await Promise.all([
    prisma.holding.findMany({ include: { asset: true }, orderBy: { createdAt: "desc" } }),
    prisma.asset.findMany({ orderBy: { symbol: "asc" } }),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Holdings</h1>

      {assets.length === 0 ? (
        <p className="text-sm opacity-60">Add an asset first on the Assets page.</p>
      ) : (
        <form action={createHolding} className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-end">
          <label className="flex flex-col gap-1 text-sm">
            Asset
            <select
              name="assetId"
              className="border rounded-md px-2 py-1.5 border-black/10 dark:border-white/20 bg-transparent"
            >
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.symbol} — {asset.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Account / bank
            <input
              name="accountName"
              required
              placeholder="IBKR, Binance…"
              className="border rounded-md px-2 py-1.5 border-black/10 dark:border-white/20 bg-transparent"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Quantity
            <input
              name="quantity"
              type="number"
              step="any"
              required
              className="border rounded-md px-2 py-1.5 border-black/10 dark:border-white/20 bg-transparent"
            />
          </label>
          <button
            type="submit"
            className="rounded-md border border-black/10 dark:border-white/20 px-4 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/10"
          >
            Add holding
          </button>
        </form>
      )}

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-black/10 dark:border-white/10">
            <th className="py-2">Symbol</th>
            <th className="py-2">Account</th>
            <th className="py-2">Quantity</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding) => (
            <tr key={holding.id} className="border-b border-black/5 dark:border-white/5">
              <td className="py-2">{holding.asset.symbol}</td>
              <td className="py-2">{holding.accountName}</td>
              <td className="py-2">{holding.quantity}</td>
              <td className="py-2 text-right">
                <form action={deleteHolding}>
                  <input type="hidden" name="id" value={holding.id} />
                  <button className="text-xs opacity-60 hover:opacity-100 hover:underline">
                    Delete
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
