import type { AssetType, PriceSource } from "@/app/generated/prisma/client";
import { coingeckoProvider } from "./coingecko";
import { yahooProvider } from "./yahoo";
import type { PriceProvider, PriceQuote } from "./types";

export type { PriceProvider, PriceQuote };
export { convertCurrency } from "./fx";

export async function fetchPrice(
  type: AssetType,
  symbol: string,
): Promise<{ quote: PriceQuote; source: PriceSource }> {
  if (type === "CRYPTO") {
    return { quote: await coingeckoProvider.fetchPrice(symbol), source: "COINGECKO" };
  }
  return { quote: await yahooProvider.fetchPrice(symbol), source: "YAHOO" };
}

export async function fetchHistory(
  type: AssetType,
  symbol: string,
  from: Date,
  to: Date,
): Promise<{ quotes: PriceQuote[]; source: PriceSource }> {
  if (type === "CRYPTO") {
    return { quotes: await coingeckoProvider.fetchHistory(symbol, from, to), source: "COINGECKO" };
  }
  return { quotes: await yahooProvider.fetchHistory(symbol, from, to), source: "YAHOO" };
}

export const providers: Record<string, PriceProvider> = {
  YAHOO: yahooProvider,
  COINGECKO: coingeckoProvider,
};
