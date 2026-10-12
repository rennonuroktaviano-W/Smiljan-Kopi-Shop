import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/config";

/**
 * Lapisan pertama proteksi: memverifikasi sesi JWT untuk seluruh /admin/*
 * (kecuali /admin/login). Otorisasi berbasis izin tetap ditegakkan di server
 * pada setiap halaman dan mutasi — proxy bukan batas keamanan tunggal.
 *
 * Next.js 16 mengganti konvensi `middleware` dengan `proxy`.
 */
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: ["/admin/:path*"],
};
