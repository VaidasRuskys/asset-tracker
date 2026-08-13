import { prisma } from "@/lib/prisma";
import { createAsset, deleteAsset } from "./actions";
import HistoryFetchButton from "./HistoryFetchButton";

export const dynamic = "force-dynamic";

export default async function AssetsPage() {
  const assets = await prisma.asset.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Assets</h1>

      <form action={createAsset} className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-end">
        <label className="flex flex-col gap-1 text-sm">
          Type
          <select name="type" className="border rounded-md px-2 py-1.5 border-black/10 dark:border-white/20 bg-transparent">
            <option value="STOCK">Stock</option>
            <option value="CRYPTO">Crypto</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Symbol
          <input
            name="symbol"
            required
            placeholder="AAPL / BTC"
            className="border rounded-md px-2 py-1.5 border-black/10 dark:border-white/20 bg-transparent"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Name
          <input
            name="name"
            required
            placeholder="Apple Inc."
            className="border rounded-md px-2 py-1.5 border-black/10 dark:border-white/20 bg-transparent"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Currency
          <input
            name="currency"
            required
            defaultValue="USD"
            className="border rounded-md px-2 py-1.5 border-black/10 dark:border-white/20 bg-transparent"
          />
        </label>
        <button
          type="submit"
          className="rounded-md border border-black/10 dark:border-white/20 px-4 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/10"
        >
          Add asset
        </button>
      </form>

      <p className="text-xs opacity-60 -mt-4">
        Stock symbols are Yahoo Finance tickers (e.g. <code>AAPL</code>, <code>VWCE.DE</code>);
        crypto accepts a ticker (e.g. <code>BTC</code>) or a CoinGecko coin id (e.g.{" "}
        <code>bitcoin</code>) — tickers are resolved to the coin id automatically.
      </p>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-black/10 dark:border-white/10">
            <th className="py-2">Type</th>
            <th className="py-2">Symbol</th>
            <th className="py-2">Name</th>
            <th className="py-2">Currency</th>
            <th className="py-2">History</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset.id} className="border-b border-black/5 dark:border-white/5">
              <td className="py-2">{asset.type}</td>
              <td className="py-2">{asset.symbol}</td>
              <td className="py-2">{asset.name}</td>
              <td className="py-2">{asset.currency}</td>
              <td className="py-2">
                <HistoryFetchButton assetId={asset.id} />
              </td>
              <td className="py-2 text-right">
                <form action={deleteAsset}>
                  <input type="hidden" name="id" value={asset.id} />
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
