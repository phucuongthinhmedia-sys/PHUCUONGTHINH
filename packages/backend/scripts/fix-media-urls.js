const { Client } = require('pg');

const OLD_BASES = [
  'https://phucuongthinh.s3.amazonaws.com',
  'https://pub-0af0cb8d25830dec9be29349736c9749.r2.dev',
];
const NEW_BASE = 'https://pub-f34efaa8f95d4557b118334a6e4e8448.r2.dev';

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const { rows } = await client.query('SELECT id, file_url FROM media');
  console.log(`Total media records: ${rows.length}`);

  let fixed = 0;
  for (const row of rows) {
    const oldUrl = row.file_url;
    const matchedBase = OLD_BASES.find((b) => oldUrl.startsWith(b));
    if (matchedBase) {
      const newUrl = oldUrl.replace(matchedBase, NEW_BASE);
      await client.query('UPDATE media SET file_url = $1 WHERE id = $2', [
        newUrl,
        row.id,
      ]);
      console.log(`✅ ${row.id}: ${newUrl}`);
      fixed++;
    }
  }

  console.log(`\nFixed ${fixed}/${rows.length} records`);
  await client.end();
}

main().catch((err) => {
  console.error('❌', err.message);
  process.exit(1);
});
