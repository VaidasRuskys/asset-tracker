"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function recordBalance(formData: FormData) {
  const accountName = (formData.get("accountName") as string).trim();
  const currency = (formData.get("currency") as string).trim().toUpperCase();
  const balance = parseFloat(formData.get("balance") as string);

  await prisma.bankBalance.create({ data: { accountName, currency, balance } });
  revalidatePath("/bank-balances");
  revalidatePath("/");
}
