import dotenv from 'dotenv';
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

dotenv.config({ path: './prisma/.env' });

const databaseUrlValue = process.env.DATABASE_URL;
if (!databaseUrlValue) {
	throw new Error('DATABASE_URL environment variable is required');
}

const databaseUrl = new URL(databaseUrlValue);
const adapter = new PrismaMariaDb({
	host: databaseUrl.hostname,
	port: Number(databaseUrl.port || 3306),
	user: decodeURIComponent(databaseUrl.username),
	password: decodeURIComponent(databaseUrl.password),
	database: databaseUrl.pathname.slice(1),
});

const prisma = new PrismaClient({ adapter });

export default prisma;