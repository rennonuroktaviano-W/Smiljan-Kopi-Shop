import { connect } from "./db-helpers";

async function main() {
  const connection = await connect();
  console.log(`Menerapkan migrasi ke ${connection.label}...`);
  await connection.migrate();
  await connection.close();
  console.log("Migrasi selesai.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
