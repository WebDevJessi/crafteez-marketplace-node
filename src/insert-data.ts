type ProductSeed = {
  name: string;
  slug: string;
  isAvailable: boolean;
  price: number;
  extras: Record<string, string | number>;
  pictures: Record<string, string>;
  categoryId: number;
  description?: string;
};

type ProductCreateManyClient = {
  product: {
    createMany: (args: {
      data: ProductSeed[];
      skipDuplicates: boolean;
    }) => Promise<unknown>;
  };
};

export async function insertProducts(client: ProductCreateManyClient) {
  return client.product.createMany({
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
        categoryId: 1,
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
      {
        name: 'Paint Journal',
        slug: 'paint-journal',
        isAvailable: true,
        price: 17,
        extras: {
          width: 168,
          height: 109,
          energy: 'Class C+',
        },
        pictures: {
          'journal.jpg': '/assets/journal.jpg',
        },
        categoryId: 1,
      },
      {
        name: 'Washi Tape',
        slug: 'washi-tape',
        isAvailable: true,
        price: 34,
        extras: {
          width: 168,
          height: 109,
          energy: 'Class C+',
        },
        pictures: {
          'washi-tape3.jpg': '/assets/washi-tape3.jpg',
        },
        categoryId: 1,
      },
      {
        name: 'Paint Brush Set',
        slug: 'paint-brush-set',
        isAvailable: true,
        price: 12,
        extras: {
          width: 168,
          height: 109,
          energy: 'Class C+',
        },
        pictures: {
          'paint-brush.jpg': '/assets/paint-brush.jpg',
        },
        categoryId: 1,
      },
      {
        name: 'Knitting Essentials Kit',
        slug: 'knitting-essentials-kit',
        isAvailable: true,
        price: 32,
        extras: {
          width: 168,
          height: 109,
          energy: 'Class C+',
        },
        pictures: {
          'knitting-essentials.png': '/assets/knitting-essentials.png',
        },
        categoryId: 1,
      },
    ],
    skipDuplicates: true,
  });
}
