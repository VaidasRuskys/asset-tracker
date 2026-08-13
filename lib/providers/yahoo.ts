import YahooFinance from "yahoo-finance2";
import type { PriceProvider, PriceQuote } from "./types";

const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

// `symbol` is a Yahoo Finance ticker, e.g. "AAPL", "VWCE.DE".
export const yahooProvider: PriceProvider = {
  source: "YAHOO",
  async fetchPrice(symbol: string): Promise<PriceQuote> {
    const quote = await yahooFinance.quote(symbol);
    if (!quote?.regularMarketPrice) {
      throw new Error(`Yahoo Finance returned no price for ${symbol}`);
    }
    return {
      price: quote.regularMarketPrice,
      currency: quote.currency ?? "USD",
      date: new Date(),
    };
  },
  async fetchHistory(symbol: string, from: Date, to: Date): Promise<PriceQuote[]> {
    const result = await yahooFinance.chart(symbol, { period1: from, period2: to, interval: "1d" });
    const currency = result.meta.currency ?? "USD";
    return result.quotes
      .filter((q) => typeof q.close === "number")
      .map((q) => ({ price: q.close as number, currency, date: q.date }));
  },
};
