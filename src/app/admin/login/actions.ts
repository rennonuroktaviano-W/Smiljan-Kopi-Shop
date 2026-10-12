"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import { parseCredentials } from "@/lib/auth/validation";

export interface LoginState {
  error: string | null;
}

export async function loginAction(
  _previous: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");

  const credentials = parseCredentials({
    email: typeof email === "string" ? email : "",
    password: typeof password === "string" ? password : "",
  });

  if (!credentials) {
    return { error: "Email atau kata sandi tidak valid." };
  }

  try {
    await signIn("credentials", {
      email: credentials.email,
      password: credentials.password,
      redirectTo: "/admin",
    });
    return { error: null };
  } catch (error) {
    // Redirect sukses dilempar sebagai error khusus dan harus diteruskan.
    if (error instanceof AuthError) {
      return { error: "Email atau kata sandi tidak valid." };
    }
    throw error;
  }
}
