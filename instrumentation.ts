export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startPriceFetchScheduler } = await import("@/lib/jobs/scheduler");
    startPriceFetchScheduler();
  }
}
