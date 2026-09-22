import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.category.createMany({
    data: [
      { name: 'Slime' },
      { name: 'Crafting Materials' },
      { name: 'Sewing Materials' },
      { name: 'Arts and Crafts' },
    ],
    skipDuplicates: true,
  });

}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());