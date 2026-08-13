import type { PriceSource } from "@/app/generated/prisma/client";

export interface PriceQuote {
  price: number;
  currency: string;
  date: Date;
}

export interface PriceProvider {
  source: PriceSource;
  fetchPrice(symbol: string): Promise<PriceQuote>;
}
