import prisma from '../prisma.ts';

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
  .catch((error) => {
    console.error('Failed to seed database:', error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());