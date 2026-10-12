"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import {
  createMenuItem,
  deleteMenuItem,
  getMenuItemById,
  setMenuItemPublished,
  updateMenuItem,
} from "@/lib/db/repositories/menu";
import type { NewMenuItem } from "@/lib/db/schema";
import { requirePermission } from "@/lib/auth/guard";
import { recordAudit } from "@/lib/audit/log";
import { validateMenuItem, type MenuItemDraft } from "@/lib/menu/validation";

export interface MenuFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

function str(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function draftFromFormData(formData: FormData): MenuItemDraft {
  return {
    id: str(formData, "id"),
    name: str(formData, "name"),
    description: str(formData, "description"),
    categoryId: str(formData, "categoryId"),
    price: str(formData, "price"),
    image: str(formData, "image"),
    imageAlt: str(formData, "imageAlt"),
    featured: formData.get("featured") !== null,
    availabilityStatus: str(formData, "availabilityStatus"),
    imageSource: str(formData, "imageSource"),
    imageLicense: str(formData, "imageLicense"),
    sourceUrl: str(formData, "sourceUrl"),
    isPublished: formData.get("isPublished") !== null,
  };
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as { code?: string }).code === "23505"
  );
}

async function auditContext(): Promise<{
  ip: string | undefined;
  userAgent: string | undefined;
}> {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  return {
    ip: forwarded?.split(",")[0]?.trim() || undefined,
    userAgent: headerList.get("user-agent") ?? undefined,
  };
}

function refreshMenuViews(): void {
  revalidatePath("/menu");
  revalidatePath("/admin/menu");
}

export async function createMenuItemAction(
  _previous: MenuFormState,
  formData: FormData
): Promise<MenuFormState> {
  const user = await requirePermission("menu.manage");
  const result = validateMenuItem(draftFromFormData(formData));
  if (!result.ok) return { fieldErrors: result.errors };

  const db = await getDb();
  try {
    await createMenuItem(db, result.value);
  } catch (error) {
    if (isUniqueViolation(error)) {
      return { fieldErrors: { id: "ID ini sudah dipakai. Gunakan ID lain." } };
    }
    console.error("[menu] gagal membuat item", error);
    return { error: "Gagal menyimpan item. Silakan coba lagi." };
  }

  const context = await auditContext();
  await recordAudit({
    actorId: user.id,
    actorEmail: user.email,
    action: "menu.create",
    resource: "menu_item",
    resourceId: result.value.id,
    outcome: "success",
    metadata: { name: result.value.name },
    ip: context.ip,
    userAgent: context.userAgent,
  });
  refreshMenuViews();
  redirect("/admin/menu");
}

export async function updateMenuItemAction(
  _previous: MenuFormState,
  formData: FormData
): Promise<MenuFormState> {
  const user = await requirePermission("menu.manage");
  const id = str(formData, "id").trim();
  if (!id) return { error: "ID item tidak ditemukan." };

  const result = validateMenuItem(draftFromFormData(formData));
  if (!result.ok) return { fieldErrors: result.errors };
  if (result.value.id !== id) {
    return { fieldErrors: { id: "ID tidak dapat diubah setelah dibuat." } };
  }

  const db = await getDb();
  const existing = await getMenuItemById(db, id);
  if (!existing) return { error: "Item tidak ditemukan." };

  const patch: Partial<NewMenuItem> = {
    name: result.value.name,
    description: result.value.description,
    categoryId: result.value.categoryId,
    price: result.value.price,
    image: result.value.image,
    imageAlt: result.value.imageAlt,
    featured: result.value.featured,
    availabilityStatus: result.value.availabilityStatus,
    imageSource: result.value.imageSource,
    imageLicense: result.value.imageLicense,
    sourceUrl: result.value.sourceUrl,
    isPublished: result.value.isPublished,
  };
  try {
    await updateMenuItem(db, id, patch);
  } catch (error) {
    console.error("[menu] gagal memperbarui item", error);
    return { error: "Gagal memperbarui item. Silakan coba lagi." };
  }

  const context = await auditContext();
  await recordAudit({
    actorId: user.id,
    actorEmail: user.email,
    action: "menu.update",
    resource: "menu_item",
    resourceId: id,
    outcome: "success",
    metadata: { name: result.value.name },
    ip: context.ip,
    userAgent: context.userAgent,
  });
  refreshMenuViews();
  redirect("/admin/menu");
}

export async function toggleMenuItemPublishAction(
  formData: FormData
): Promise<void> {
  const user = await requirePermission("menu.manage");
  const id = str(formData, "id").trim();
  const publish = str(formData, "publish") === "true";
  if (!id) redirect("/admin/menu");

  const db = await getDb();
  const existing = await getMenuItemById(db, id);
  if (!existing) redirect("/admin/menu");

  await setMenuItemPublished(db, id, publish);
  const context = await auditContext();
  await recordAudit({
    actorId: user.id,
    actorEmail: user.email,
    action: publish ? "menu.publish" : "menu.unpublish",
    resource: "menu_item",
    resourceId: id,
    outcome: "success",
    metadata: { name: existing.name },
    ip: context.ip,
    userAgent: context.userAgent,
  });
  refreshMenuViews();
  redirect("/admin/menu");
}

export async function deleteMenuItemAction(formData: FormData): Promise<void> {
  const user = await requirePermission("menu.manage");
  const id = str(formData, "id").trim();
  if (!id) redirect("/admin/menu");

  const db = await getDb();
  const existing = await getMenuItemById(db, id);
  await deleteMenuItem(db, id);

  const context = await auditContext();
  await recordAudit({
    actorId: user.id,
    actorEmail: user.email,
    action: "menu.delete",
    resource: "menu_item",
    resourceId: id,
    outcome: "success",
    metadata: { name: existing?.name ?? null },
    ip: context.ip,
    userAgent: context.userAgent,
  });
  refreshMenuViews();
  redirect("/admin/menu");
}
