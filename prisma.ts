import dotenv from 'dotenv';
import { PrismaClient } from "@prisma/client";
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

export default prisma;