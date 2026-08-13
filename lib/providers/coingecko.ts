import type { PriceProvider, PriceQuote } from "./types";

const BASE_URL = "https://api.coingecko.com/api/v3";

// `symbol` must be a CoinGecko coin id, e.g. "bitcoin", "ethereum".
export const coingeckoProvider: PriceProvider = {
  source: "COINGECKO",
  async fetchPrice(symbol: string): Promise<PriceQuote> {
    const url = `${BASE_URL}/simple/price?ids=${encodeURIComponent(symbol)}&vs_currencies=usd`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`CoinGecko request failed for ${symbol}: ${res.status}`);
    }
    const data = await res.json();
    const price = data[symbol]?.usd;
    if (typeof price !== "number") {
      throw new Error(`CoinGecko returned no price for ${symbol}`);
    }
    return { price, currency: "USD", date: new Date() };
  },
};
