const target = process.argv[2];
if (target !== 'local' && target !== 'production') {
  throw new Error(
    'Choose a database target: run `npm run update:product-descriptions:local` or `npm run update:product-descriptions:production`.',
  );
}

const productionDatabaseUrl = process.env.PRODUCTION_DATABASE_URL;
if (target === 'production') {
  if (!productionDatabaseUrl) {
    throw new Error('Set PRODUCTION_DATABASE_URL to the production database connection URL.');
  }
  if (process.env.CONFIRM_PRODUCTION_PRODUCT_DESCRIPTION_UPDATE !== 'update-descriptions') {
    throw new Error(
      'Set CONFIRM_PRODUCTION_PRODUCT_DESCRIPTION_UPDATE=update-descriptions to confirm the production update.',
    );
  }

  process.env.DATABASE_URL = productionDatabaseUrl;
}

const { default: prisma } = await import('../prisma.ts');
const { updateProductDescriptions } = await import('./insert-data.ts');

console.log(`Updating product descriptions in the ${target} database.`);

try {
  const result = await updateProductDescriptions(prisma);
  console.log(`Updated descriptions for ${result.updated.length} products.`);

  if (result.missing.length > 0) {
    console.error(`Products not found: ${result.missing.join(', ')}`);
    process.exitCode = 1;
  }
} catch (error) {
  console.error('Failed to update product descriptions:', error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
