import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import {
  getClientIp,
  isLoginRateLimited,
  recordAudit,
  recordLoginAttempt,
} from "@/lib/audit/log";
import { authConfig } from "./config";
import { verifyPassword } from "./password";
import { parseCredentials } from "./validation";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Kata sandi", type: "password" },
      },
      async authorize(raw, request) {
        const credentials = parseCredentials(raw);
        if (!credentials) return null;

        const ip = getClientIp(request);
        const userAgent = request.headers.get("user-agent");

        if (await isLoginRateLimited(credentials.email, ip)) {
          await recordAudit({
            action: "auth.login",
            resource: "session",
            outcome: "failure",
            actorEmail: credentials.email,
            ip,
            userAgent,
            metadata: { reason: "rate_limited" },
          });
          return null;
        }

        const db = await getDb();
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email))
          .limit(1);

        const passwordValid =
          user && user.isActive
            ? await verifyPassword(credentials.password, user.passwordHash)
            : false;

        await recordLoginAttempt(credentials.email, ip, Boolean(passwordValid));

        if (!user || !user.isActive || !passwordValid) {
          await recordAudit({
            action: "auth.login",
            resource: "session",
            outcome: "failure",
            actorId: user?.id ?? null,
            actorEmail: credentials.email,
            ip,
            userAgent,
            metadata: { reason: "invalid_credentials" },
          });
          return null;
        }

        await db
          .update(users)
          .set({ lastLoginAt: new Date(), updatedAt: new Date() })
          .where(eq(users.id, user.id));

        await recordAudit({
          action: "auth.login",
          resource: "session",
          resourceId: user.id,
          outcome: "success",
          actorId: user.id,
          actorEmail: user.email,
          ip,
          userAgent,
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          sessionVersion: user.sessionVersion,
        };
      },
    }),
  ],
});
