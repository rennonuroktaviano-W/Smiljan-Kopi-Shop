import { connect, seedOwner } from "./db-helpers";

/**
 * Membuat akun owner awal secara aman (tanpa endpoint publik). Tidak ada kata
 * sandi yang di-hardcode: nilai dibaca dari variabel lingkungan:
 *   OWNER_EMAIL, OWNER_PASSWORD, OWNER_NAME (opsional)
 */
async function main() {
  const email = process.env.OWNER_EMAIL?.trim();
  const password = process.env.OWNER_PASSWORD ?? "";
  const name = process.env.OWNER_NAME?.trim();

  if (!email) {
    throw new Error("OWNER_EMAIL wajib diisi.");
  }
  if (!password) {
    throw new Error("OWNER_PASSWORD wajib diisi.");
  }

  const connection = await connect();
  const result = await seedOwner(connection, { email, password, name });
  await connection.close();

  console.log(
    result.created
      ? `Akun owner dibuat: ${result.email}`
      : `Akun owner diperbarui (kata sandi & sesi lama dicabut): ${result.email}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
