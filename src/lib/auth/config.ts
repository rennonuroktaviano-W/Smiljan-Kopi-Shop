import type { NextAuthConfig } from "next-auth";
import type { Role } from "./roles";
import { isRole } from "./roles";

/**
 * Konfigurasi dasar yang aman untuk Edge Middleware: TIDAK mengimpor basis
 * data atau modul Node apa pun. Middleware hanya memverifikasi JWT dan
 * menegakkan proteksi rute; otorisasi berbasis basis data dilakukan di server
 * (lihat `guard.ts`).
 */
export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = Boolean(auth?.user);
      const isLoginPage = nextUrl.pathname === "/admin/login";

      if (isLoginPage) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/admin", nextUrl));
        }
        return true;
      }

      return isLoggedIn;
    },
    jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.role = user.role;
        token.sv = user.sessionVersion;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.uid === "string" ? token.uid : "";
        session.user.role = isRole(token.role) ? token.role : "viewer";
        session.user.sessionVersion =
          typeof token.sv === "number" ? token.sv : 0;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export type { Role };
