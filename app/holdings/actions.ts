"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createHolding(formData: FormData) {
  const assetId = formData.get("assetId") as string;
  const accountName = (formData.get("accountName") as string).trim();
  const quantity = parseFloat(formData.get("quantity") as string);

  await prisma.holding.create({ data: { assetId, accountName, quantity } });
  revalidatePath("/holdings");
  revalidatePath("/");
}

export async function deleteHolding(formData: FormData) {
  const id = formData.get("id") as string;
  await prisma.holding.delete({ where: { id } });
  revalidatePath("/holdings");
  revalidatePath("/");
}
