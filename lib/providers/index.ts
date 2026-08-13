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

export const providers: Record<string, PriceProvider> = {
  YAHOO: yahooProvider,
  COINGECKO: coingeckoProvider,
};
