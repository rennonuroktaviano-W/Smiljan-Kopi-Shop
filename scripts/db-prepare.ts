import { connect, seedMenu, seedOwner } from "./db-helpers";

/**
 * Menyiapkan basis data lokal untuk pengembangan/tes: menjalankan migrasi lalu
 * membuat/memperbarui akun owner dari variabel OWNER_EMAIL/OWNER_PASSWORD.
 */
async function main() {
  const email = process.env.OWNER_EMAIL?.trim();
  const password = process.env.OWNER_PASSWORD ?? "";
  const name = process.env.OWNER_NAME?.trim();

  if (!email || !password) {
    throw new Error(
      "OWNER_EMAIL dan OWNER_PASSWORD wajib diisi untuk menyiapkan akun owner."
    );
  }

  const connection = await connect();
  console.log(`Menyiapkan basis data (${connection.label})...`);
  await connection.migrate();

  const result = await seedOwner(connection, { email, password, name });
  const menu = await seedMenu(connection);
  await connection.close();

  console.log(
    result.created
      ? `Akun owner dibuat: ${result.email}`
      : `Akun owner diperbarui: ${result.email}`
  );
  console.log(
    `Katalog menu disinkronkan: ${menu.items} item, ${menu.categories} kategori.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
