import dotenv from 'dotenv';
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

dotenv.config({ path: './prisma/.env' });

const databaseUrlValue = process.env.DATABASE_URL;
if (!databaseUrlValue) {
	throw new Error(
		'DATABASE_URL is required. Copy prisma/.env.example to prisma/.env and set your MySQL connection details.',
	);
}

let databaseUrl: URL;
try {
	databaseUrl = new URL(databaseUrlValue);
} catch {
	throw new Error('DATABASE_URL must be a valid MySQL connection URL.');
}
if (databaseUrl.protocol !== 'mysql:' || !databaseUrl.hostname || databaseUrl.pathname.length < 2) {
	throw new Error('DATABASE_URL must use mysql:// and include a host and database name.');
}

const adapter = new PrismaMariaDb({
	host: databaseUrl.hostname,
	port: Number(databaseUrl.port || 3306),
	user: decodeURIComponent(databaseUrl.username),
	password: decodeURIComponent(databaseUrl.password),
	database: decodeURIComponent(databaseUrl.pathname.slice(1)),
});

const prisma = new PrismaClient({ adapter });

export default prisma;