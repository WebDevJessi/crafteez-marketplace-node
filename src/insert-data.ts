type ProductSeed = {
  name: string;
  slug: string;
  isAvailable: boolean;
  price: number;
  extras: Record<string, string | number>;
  pictures: Record<string, string>;
  categoryId: number;
  description: string;
};

type ProductCreateManyClient = {
  category: {
    findUnique: (args: { where: { name: string } }) => Promise<{ id: number } | null>;
  };
  product: {
    createMany: (args: {
      data: ProductSeed[];
      skipDuplicates: boolean;
    }) => Promise<unknown>;
  };
};

const products: Omit<ProductSeed, 'categoryId'>[] = [
    {
      name: 'Rainbow Cloud',
      slug: 'rainbow-cloud',
      isAvailable: true,
      price: 20,
      description: 'A colorful, cloud-inspired sensory pick for imaginative hands-on play.',
      extras: {
        width: 168,
        height: 109,
        energy: 'Class A+',
      },
      pictures: {
        'rainbow-cloud.jpg': '/assets/rainbow-cloud.jpg',
      },
    },
    {
      name: 'Pink Crunch',
      slug: 'pink-crunch',
      isAvailable: true,
      price: 25,
      description: 'An ASMR-inspired sensory pick for a satisfying, hands-on play session.',
      extras: {
        width: 168,
        height: 109,
        energy: 'Class A+',
      },
      pictures: {
        'pink-crunch.jpg': '/assets/pink-crunch.jpg',
      },
    },
    {
      name: 'Sunkissed Orange',
      slug: 'sunkissed-orange',
      isAvailable: true,
      price: 20,
      description: 'A bright orange-inspired sensory pick that adds a sunny pop of color to playtime.',
      extras: {
        width: 168,
        height: 109,
        energy: 'Class A+',
      },
      pictures: {
        'Sunshine-orange.jpg': '/assets/Sunshine-orange.jpg',
      },
    },
    {
      name: 'Starry Clear',
      slug: 'starry-clear',
      isAvailable: true,
      price: 20,
      description: 'A clear, starry-inspired sensory pick made for imaginative, hands-on play.',
      extras: {
        width: 168,
        height: 109,
        energy: 'Class A+',
      },
      pictures: {
        'starry-clear.jpg': '/assets/starry-clear.jpg',
      },
    },
    {
      name: 'Yarn Essentials Kit',
      slug: 'yarn-essentials-kit',
      isAvailable: true,
      price: 34,
      description: 'A handy kit for exploring yarn crafts and bringing your next creative project to life.',
      extras: {
        width: 168,
        height: 109,
        energy: 'Class B+',
      },
      pictures: {
        'yarn-kit.jpg': '/assets/yarn-kit.jpg',
      },
    },
    {
      name: 'Gouache Paint',
      slug: 'gouache-paint',
      isAvailable: true,
      price: 34,
      description: 'Explore expressive color and create paintings or mixed-media art with gouache paint.',
      extras: {
        width: 168,
        height: 109,
        energy: 'Class C+',
      },
      pictures: {
        'gouache paint set.jpg': '/assets/gouache paint set.jpg',
      },
    },
    {
      name: 'Paint Journal',
      slug: 'paint-journal',
      isAvailable: true,
      price: 17,
      description: 'A dedicated space for sketches, color studies, and capturing creative ideas.',
      extras: {
        width: 168,
        height: 109,
        energy: 'Class C+',
      },
      pictures: {
        'journal.jpg': '/assets/journal.jpg',
      },
    },
    {
      name: 'Washi Tape',
      slug: 'washi-tape',
      isAvailable: true,
      price: 34,
      description: 'Add color and personality to journals, cards, and paper crafts with decorative washi tape.',
      extras: {
        width: 168,
        height: 109,
        energy: 'Class C+',
      },
      pictures: {
        'washi-tape3.jpg': '/assets/washi-tape3.jpg',
      },
    },
    {
      name: 'Paint Brush Set',
      slug: 'paint-brush-set',
      isAvailable: true,
      price: 12,
      description: 'A paint brush set for applying color to a variety of art and craft projects.',
      extras: {
        width: 168,
        height: 109,
        energy: 'Class C+',
      },
      pictures: {
        'paint-brush.jpg': '/assets/paint-brush.jpg',
      },
    },
    {
      name: 'Knitting Essentials Kit',
      slug: 'knitting-essentials-kit',
      isAvailable: true,
      price: 32,
      description: 'A practical kit for learning knitting basics and getting started on a new project.',
      extras: {
        width: 168,
        height: 109,
        energy: 'Class C+',
      },
      pictures: {
        'knitting-essentials.png': '/assets/knitting-essentials.png',
      },
    },
];

export async function insertProducts(client: ProductCreateManyClient) {
  const slimeCategory = await client.category.findUnique({
    where: { name: 'Slime' },
  });
  if (!slimeCategory) {
    throw new Error('Seed the Slime category before inserting products');
  }

  return client.product.createMany({
    data: products.map((product) => ({
      ...product,
      categoryId: slimeCategory.id,
    })),
    skipDuplicates: true,
  });
}

type ProductDescriptionUpdateClient = {
  product: {
    updateMany: (args: {
      where: { slug: string };
      data: { description: string };
    }) => Promise<{ count: number }>;
  };
};

export async function updateProductDescriptions(client: ProductDescriptionUpdateClient) {
  const results = await Promise.all(
    products.map(async ({ slug, description }) => {
      const result = await client.product.updateMany({
        where: { slug },
        data: { description },
      });
      return { slug, updated: result.count > 0 };
    }),
  );

  return {
    updated: results.filter(({ updated }) => updated).map(({ slug }) => slug),
    missing: results.filter(({ updated }) => !updated).map(({ slug }) => slug),
  };
}
