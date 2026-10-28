import prisma from '../prisma.ts';
import { insertProducts } from './insert-data.ts';

async function main() {
  try {
    const productsCreated = await insertProducts(prisma);
    console.log(productsCreated);
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
