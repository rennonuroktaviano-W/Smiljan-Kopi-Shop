import { connect, seedMenu } from "./db-helpers";

/**
 * Menyalin katalog menu statis ke basis data tanpa menyentuh akun pengguna.
 * Berguna untuk menyiapkan konten awal pada Neon (produksi) setelah migrasi.
 */
async function main() {
  const connection = await connect();
  console.log(`Menyinkronkan katalog menu ke ${connection.label}...`);
  await connection.migrate();
  const result = await seedMenu(connection);
  await connection.close();
  console.log(
    `Selesai: ${result.items} item, ${result.categories} kategori.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
