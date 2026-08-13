import type { PriceProvider, PriceQuote } from "./types";

const BASE_URL = "https://api.coingecko.com/api/v3";

// Resolves a ticker (e.g. "BTC") or a coin id already ("bitcoin") to the
// canonical CoinGecko coin id, so /simple/price lookups succeed either way.
// Falls back to the original input if search finds nothing or errors out —
// callers still get the input they gave, just unresolved.
export async function resolveCoinId(query: string): Promise<string> {
  try {
    const res = await fetch(`${BASE_URL}/search?query=${encodeURIComponent(query)}`);
    if (!res.ok) return query;
    const data = await res.json();
    const coins: Array<{ id: string; symbol: string }> = data.coins ?? [];
    if (coins.length === 0) return query;

    const q = query.toLowerCase();
    const match =
      coins.find((c) => c.id.toLowerCase() === q) ??
      coins.find((c) => c.symbol.toLowerCase() === q) ??
      coins[0];
    return match.id;
  } catch {
    return query;
  }
}

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
