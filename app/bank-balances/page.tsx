import { prisma } from "@/lib/prisma";
import { recordBalance } from "./actions";

export const dynamic = "force-dynamic";

export default async function BankBalancesPage() {
  const balances = await prisma.bankBalance.findMany({ orderBy: { recordedAt: "desc" } });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Bank balances</h1>
      <p className="text-sm opacity-60 -mt-6">
        No automated sync — record a balance here whenever you check it, and the history builds
        up over time.
      </p>

      <form action={recordBalance} className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-end">
        <label className="flex flex-col gap-1 text-sm">
          Account
          <input
            name="accountName"
            required
            placeholder="Revolut, SEB…"
            className="border rounded-md px-2 py-1.5 border-black/10 dark:border-white/20 bg-transparent"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Balance
          <input
            name="balance"
            type="number"
            step="any"
            required
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
          Record balance
        </button>
      </form>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-black/10 dark:border-white/10">
            <th className="py-2">Account</th>
            <th className="py-2">Balance</th>
            <th className="py-2">Recorded</th>
          </tr>
        </thead>
        <tbody>
          {balances.map((b) => (
            <tr key={b.id} className="border-b border-black/5 dark:border-white/5">
              <td className="py-2">{b.accountName}</td>
              <td className="py-2">
                {b.balance.toLocaleString()} {b.currency}
              </td>
              <td className="py-2 opacity-60">{new Date(b.recordedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
