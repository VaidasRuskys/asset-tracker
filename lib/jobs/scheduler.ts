import cron from "node-cron";
import { runPriceFetchJob } from "./priceFetch";

let started = false;

// Runs once per day at 06:00 server time. Started from instrumentation.ts
// so it only registers a single interval per server process.
export function startPriceFetchScheduler() {
  if (started) return;
  started = true;

  cron.schedule("0 6 * * *", () => {
    runPriceFetchJob().catch((err) => {
      console.error("Scheduled price fetch job failed:", err);
    });
  });
}
