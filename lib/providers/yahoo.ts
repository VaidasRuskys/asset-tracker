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
};
