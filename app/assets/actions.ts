"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { AssetType } from "@/app/generated/prisma/client";

export async function createAsset(formData: FormData) {
  const type = formData.get("type") as AssetType;
  const symbol = (formData.get("symbol") as string).trim();
  const name = (formData.get("name") as string).trim();
  const currency = (formData.get("currency") as string).trim().toUpperCase();

  await prisma.asset.create({ data: { type, symbol, name, currency } });
  revalidatePath("/assets");
  revalidatePath("/");
}

export async function deleteAsset(formData: FormData) {
  const id = formData.get("id") as string;
  await prisma.asset.delete({ where: { id } });
  revalidatePath("/assets");
  revalidatePath("/");
}
