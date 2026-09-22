import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

dotenv.config({ path: './prisma/.env' });

const databaseUrl = new URL(process.env.DATABASE_URL as string);
const adapter = new PrismaMariaDb({
  host: databaseUrl.hostname,
  port: Number(databaseUrl.port || 3306),
  user: decodeURIComponent(databaseUrl.username),
  password: decodeURIComponent(databaseUrl.password),
  database: databaseUrl.pathname.slice(1),
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const productCreated = await prisma.product.create({
    data: {
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