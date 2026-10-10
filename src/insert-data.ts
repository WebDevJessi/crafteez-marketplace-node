import prisma from '../prisma.ts';

async function main() {
  const productCreated = await prisma.product.createMany({
    data: [
      {
        name: 'Rainbow Cloud',
        slug: 'rainbow-cloud',
        isAvailable: true,
        price: 20,
      extras: {
        width: 168,
        height: 109,
        energy: 'Class A+',
      },
      pictures: {
        'rainbow-cloud.jpg': '/assets/rainbow-cloud.jpg',
      },
      categoryId: 1, // Exist in the database from the seed
    },
    {
      name: 'Pink Crunch',
      slug: 'pink-crunch',
      isAvailable: true,
      price: 25,
      extras: {
        width: 168,
        height: 109,
        energy: 'Class A+',
      },
      description: 'A true ASMR experience for the senses.',
      pictures: {
        'pink-crunch.jpg': '/assets/pink-crunch.jpg',
      },
      categoryId: 1,
    },
    {
      name: 'Sunkissed Orange',
      slug: 'sunkissed-orange',
      isAvailable: true,
      price: 20,
      extras: {
        width: 168,
        height: 109,
        energy: 'Class A+',
      },
      pictures: {
        'Sunshine-orange.jpg': '/assets/Sunshine-orange.jpg',
      },
      categoryId: 1,
    },
    {
      name: 'Starry Clear',
      slug: 'starry-clear',
      isAvailable: true,
      price: 20,
      extras: {
        width: 168,
        height: 109,
        energy: 'Class A+',
      },
      pictures: {
        'starry-clear.jpg': '/assets/starry-clear.jpg',
      },
      categoryId: 1,
    },
    {
      name: 'Yarn Essentials Kit',
      slug: 'yarn-essentials-kit',
      isAvailable: true,
      price: 34,
      extras: {
        width: 168,
        height: 109,
        energy: 'Class B+',
      },
      pictures: {
        'yarn-kit.jpg': '/assets/yarn-kit.jpg',
      },
      categoryId: 1,
    },
    {
      name: 'Gouache Paint',
      slug: 'gouache-paint',
      isAvailable: true,
      price: 34,
      extras: {
        width: 168,
        height: 109,
        energy: 'Class C+',
      },
      pictures: {
        'gouache paint set.jpg': '/assets/gouache paint set.jpg',
      },
      categoryId: 1,
    },
  ],
  skipDuplicates: true,
  });

  console.log(productCreated);

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });