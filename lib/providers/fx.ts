// Frankfurter (ECB daily rates) — free, no API key required.
const BASE_URL = "https://api.frankfurter.app";

export async function convertCurrency(
  amount: number,
  from: string,
  to: string,
): Promise<number> {
  if (from === to) return amount;
  const url = `${BASE_URL}/latest?amount=${amount}&from=${from}&to=${to}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Frankfurter FX request failed (${from}->${to}): ${res.status}`);
  }
  const data = await res.json();
  const converted = data.rates?.[to];
  if (typeof converted !== "number") {
    throw new Error(`Frankfurter returned no rate for ${from}->${to}`);
  }
  return converted;
}
