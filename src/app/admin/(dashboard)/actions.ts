"use server";

import { signOut } from "@/lib/auth";
import { getCurrentUser } from "@/lib/auth/guard";
import { recordAudit } from "@/lib/audit/log";

export async function signOutAction(): Promise<void> {
  const user = await getCurrentUser();
  if (user) {
    await recordAudit({
      actorId: user.id,
      actorEmail: user.email,
      action: "auth.logout",
      resource: "session",
      resourceId: user.id,
      outcome: "success",
    });
  }
  await signOut({ redirectTo: "/admin/login" });
}
