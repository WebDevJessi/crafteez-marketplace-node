const target = process.argv[2];
if (target !== 'local' && target !== 'production') {
  throw new Error('Choose a database target: local or production.');
}

if (target === 'production') {
  const productionDatabaseUrl = process.env.PRODUCTION_DATABASE_URL;
  if (!productionDatabaseUrl) {
    throw new Error('Set PRODUCTION_DATABASE_URL to the production database connection URL.');
  }
  if (process.env.CONFIRM_PRODUCTION_PRODUCT_INSERT !== 'insert-products') {
    throw new Error(
      'Set CONFIRM_PRODUCTION_PRODUCT_INSERT=insert-products to confirm the production insert.',
    );
  }

  process.env.DATABASE_URL = productionDatabaseUrl;
}

const { default: prisma } = await import('../prisma.ts');
const { insertProducts } = await import('./insert-data.ts');

console.log(`Inserting missing catalog products into the ${target} database.`);

try {
  const result = await insertProducts(prisma);
  console.log(result);
} catch (error) {
  console.error(`Failed to insert products into the ${target} database:`, error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
