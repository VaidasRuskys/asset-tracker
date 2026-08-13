import { prisma } from "@/lib/prisma";
import { fetchPrice } from "@/lib/providers";

export interface PriceFetchResult {
  symbol: string;
  status: "updated" | "skipped" | "failed";
  error?: string;
}

function isToday(date: Date): boolean {
  const now = new Date();
  return (
    date.getUTCFullYear() === now.getUTCFullYear() &&
    date.getUTCMonth() === now.getUTCMonth() &&
    date.getUTCDate() === now.getUTCDate()
  );
}

export async function runPriceFetchJob(): Promise<PriceFetchResult[]> {
  const assets = await prisma.asset.findMany({
    include: { priceHistory: { orderBy: { date: "desc" }, take: 1 } },
  });

  const results: PriceFetchResult[] = [];

  for (const asset of assets) {
    const lastFetch = asset.priceHistory[0];
    if (lastFetch && isToday(lastFetch.date)) {
      results.push({ symbol: asset.symbol, status: "skipped" });
      continue;
    }

    try {
      const { quote, source } = await fetchPrice(asset.type, asset.symbol);
      await prisma.priceHistory.upsert({
        where: { assetId_date: { assetId: asset.id, date: startOfDay(quote.date) } },
        create: {
          assetId: asset.id,
          date: startOfDay(quote.date),
          price: quote.price,
          currency: quote.currency,
          source,
        },
        update: { price: quote.price, currency: quote.currency, source },
      });
      results.push({ symbol: asset.symbol, status: "updated" });
    } catch (err) {
      results.push({
        symbol: asset.symbol,
        status: "failed",
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return results;
}

function startOfDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}
