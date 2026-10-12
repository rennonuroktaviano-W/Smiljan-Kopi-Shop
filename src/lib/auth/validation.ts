const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface Credentials {
  email: string;
  password: string;
}

export function isValidEmail(value: string): boolean {
  return value.length <= 254 && EMAIL_PATTERN.test(value);
}

/**
 * Memvalidasi kredensial login secara defensif di server. Mengembalikan null
 * bila bentuk input tidak sah, sehingga tidak pernah mempercayai klien.
 */
export function parseCredentials(input: unknown): Credentials | null {
  if (typeof input !== "object" || input === null) return null;
  const record = input as Record<string, unknown>;

  const email = typeof record.email === "string" ? record.email.trim() : "";
  const password = typeof record.password === "string" ? record.password : "";

  if (!email || !password) return null;
  if (password.length > 200) return null;
  if (!isValidEmail(email)) return null;

  return { email: email.toLowerCase(), password };
}

export const PASSWORD_MIN_LENGTH = 10;

/**
 * Memeriksa kekuatan kata sandi untuk pembuatan akun admin. Aturan sengaja
 * sederhana namun tegas: minimal 10 karakter dan bukan hanya satu jenis.
 */
export function validatePasswordStrength(password: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Kata sandi minimal ${PASSWORD_MIN_LENGTH} karakter.`;
  }
  if (password.length > 200) {
    return "Kata sandi terlalu panjang.";
  }
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);
  const kinds = [hasLetter, hasNumber, hasSymbol].filter(Boolean).length;
  if (kinds < 2) {
    return "Kata sandi harus memuat minimal dua jenis karakter (huruf, angka, simbol).";
  }
  return null;
}
