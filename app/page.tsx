import { prisma } from "@/lib/prisma";
import { convertCurrency } from "@/lib/providers";
import RefreshButton from "./RefreshButton";

export const dynamic = "force-dynamic";

const BASE_CURRENCY = "USD";

export default async function DashboardPage() {
  const assets = await prisma.asset.findMany({
    include: {
      holdings: true,
      priceHistory: { orderBy: { date: "desc" }, take: 1 },
    },
  });
  const bankBalances = await prisma.bankBalance.findMany({
    orderBy: { recordedAt: "desc" },
  });

  const rows = await Promise.all(
    assets.map(async (asset) => {
      const quantity = asset.holdings.reduce((sum, h) => sum + h.quantity, 0);
      const latestPrice = asset.priceHistory[0];
      const rawValue = latestPrice ? latestPrice.price * quantity : 0;
      const value = latestPrice
        ? await convertCurrency(rawValue, latestPrice.currency, BASE_CURRENCY)
        : 0;
      return { asset, quantity, latestPrice, value };
    }),
  );

  const bankTotals = new Map<string, number>();
  for (const b of bankBalances) {
    if (!bankTotals.has(b.accountName)) bankTotals.set(b.accountName, b.balance);
  }
  const bankBalanceRows = await Promise.all(
    [...bankTotals.entries()].map(async ([accountName, balance]) => {
      const currency = bankBalances.find((b) => b.accountName === accountName)!.currency;
      const value = await convertCurrency(balance, currency, BASE_CURRENCY);
      return { accountName, balance, currency, value };
    }),
  );

  const totalValue =
    rows.reduce((sum, r) => sum + r.value, 0) +
    bankBalanceRows.reduce((sum, r) => sum + r.value, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-3xl font-bold mt-2">
            {totalValue.toLocaleString("en-US", { style: "currency", currency: BASE_CURRENCY })}
          </p>
        </div>
        <RefreshButton />
      </div>

      <section>
        <h2 className="text-lg font-medium mb-3">Market assets</h2>
        {rows.length === 0 ? (
          <p className="text-sm opacity-60">No assets yet. Add one on the Assets page.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-black/10 dark:border-white/10">
                <th className="py-2">Symbol</th>
                <th className="py-2">Qty</th>
                <th className="py-2">Price</th>
                <th className="py-2">Value</th>
                <th className="py-2">Updated</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ asset, quantity, latestPrice, value }) => (
                <tr key={asset.id} className="border-b border-black/5 dark:border-white/5">
                  <td className="py-2">{asset.symbol}</td>
                  <td className="py-2">{quantity}</td>
                  <td className="py-2">
                    {latestPrice
                      ? `${latestPrice.price.toLocaleString()} ${latestPrice.currency}`
                      : "—"}
                  </td>
                  <td className="py-2">
                    {value.toLocaleString("en-US", { style: "currency", currency: BASE_CURRENCY })}
                  </td>
                  <td className="py-2 opacity-60">
                    {latestPrice ? new Date(latestPrice.date).toLocaleDateString() : "never"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2 className="text-lg font-medium mb-3">Bank balances</h2>
        {bankBalanceRows.length === 0 ? (
          <p className="text-sm opacity-60">
            No balances yet. Add one on the Bank balances page.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-black/10 dark:border-white/10">
                <th className="py-2">Account</th>
                <th className="py-2">Balance</th>
                <th className="py-2">Value</th>
              </tr>
            </thead>
            <tbody>
              {bankBalanceRows.map((b) => (
                <tr key={b.accountName} className="border-b border-black/5 dark:border-white/5">
                  <td className="py-2">{b.accountName}</td>
                  <td className="py-2">
                    {b.balance.toLocaleString()} {b.currency}
                  </td>
                  <td className="py-2">
                    {b.value.toLocaleString("en-US", { style: "currency", currency: BASE_CURRENCY })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
