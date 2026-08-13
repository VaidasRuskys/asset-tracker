import { NextResponse } from "next/server";
import { runHistoricalPriceFetch, DEFAULT_HISTORY_DAYS } from "@/lib/jobs/priceHistoryFetch";

export async function POST(request: Request) {
  const body = await request.json();
  const assetId = body.assetId as string;
  const days = typeof body.days === "number" ? body.days : DEFAULT_HISTORY_DAYS;

  if (!assetId) {
    return NextResponse.json({ error: "assetId is required" }, { status: 400 });
  }

  try {
    const result = await runHistoricalPriceFetch(assetId, days);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
