import { NextResponse } from "next/server";
import { runPriceFetchJob } from "@/lib/jobs/priceFetch";

export async function POST() {
  const results = await runPriceFetchJob();
  return NextResponse.json({ results });
}
