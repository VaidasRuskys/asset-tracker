import { prisma } from "@/lib/prisma";
import { fetchHistory } from "@/lib/providers";
import { startOfDay } from "./dateUtils";

export const DEFAULT_HISTORY_DAYS = 30;

export interface PriceHistoryFetchResult {
  symbol: string;
  daysFetched: number;
}

export async function runHistoricalPriceFetch(
  assetId: string,
  days: number = DEFAULT_HISTORY_DAYS,
): Promise<PriceHistoryFetchResult> {
  const asset = await prisma.asset.findUniqueOrThrow({ where: { id: assetId } });

  const to = new Date();
  const from = new Date(to);
  from.setUTCDate(from.getUTCDate() - days);

  const { quotes, source } = await fetchHistory(asset.type, asset.symbol, from, to);

  for (const quote of quotes) {
    const date = startOfDay(quote.date);
    await prisma.priceHistory.upsert({
      where: { assetId_date: { assetId: asset.id, date } },
      create: { assetId: asset.id, date, price: quote.price, currency: quote.currency, source },
      update: { price: quote.price, currency: quote.currency, source },
    });
  }

  return { symbol: asset.symbol, daysFetched: quotes.length };
}
