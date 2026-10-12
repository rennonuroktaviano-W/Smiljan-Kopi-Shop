import { and, count, eq, gte, lt, or } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { auditLogs, loginAttempts } from "@/lib/db/schema";

export interface AuditInput {
  actorId?: string | null;
  actorEmail?: string | null;
  action: string;
  resource: string;
  resourceId?: string | null;
  outcome: "success" | "failure";
  metadata?: Record<string, unknown> | null;
  ip?: string | null;
  userAgent?: string | null;
}

/**
 * Mencatat peristiwa administratif penting. Best-effort: kegagalan menulis
 * log tidak boleh menggagalkan operasi utama, tetapi tetap dilaporkan ke
 * konsol. Tidak pernah menyimpan kata sandi, token, atau rahasia.
 */
export async function recordAudit(input: AuditInput): Promise<void> {
  try {
    const db = await getDb();
    await db.insert(auditLogs).values({
      actorId: input.actorId ?? null,
      actorEmail: input.actorEmail ?? null,
      action: input.action,
      resource: input.resource,
      resourceId: input.resourceId ?? null,
      outcome: input.outcome,
      metadata: input.metadata ?? null,
      ip: input.ip ?? null,
      userAgent: input.userAgent ?? null,
    });
  } catch (error) {
    console.error("[audit] gagal mencatat peristiwa", input.action, error);
  }
}

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_FAILURES = 8;

export async function isLoginRateLimited(
  identifier: string,
  ip: string | null
): Promise<boolean> {
  const db = await getDb();
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);
  const identity = ip
    ? or(eq(loginAttempts.identifier, identifier), eq(loginAttempts.ip, ip))
    : eq(loginAttempts.identifier, identifier);

  const rows = await db
    .select({ value: count() })
    .from(loginAttempts)
    .where(
      and(eq(loginAttempts.success, false), gte(loginAttempts.createdAt, since), identity)
    );

  return (rows[0]?.value ?? 0) >= RATE_LIMIT_MAX_FAILURES;
}

export async function recordLoginAttempt(
  identifier: string,
  ip: string | null,
  success: boolean
): Promise<void> {
  const db = await getDb();
  await db.insert(loginAttempts).values({ identifier, ip, success });

  // Pangkas catatan lama secara berkala agar tabel tidak tumbuh tanpa batas.
  if (Math.random() < 0.1) {
    try {
      await db
        .delete(loginAttempts)
        .where(lt(loginAttempts.createdAt, new Date(Date.now() - 24 * 60 * 60 * 1000)));
    } catch (error) {
      console.error("[auth] gagal memangkas catatan login lama", error);
    }
  }
}

export function getClientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || null;
  return request.headers.get("x-real-ip") ?? null;
}
