import { BunSQLiteDatabase, drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';

const sqlite = new Database('the.db');
export const db: BunSQLiteDatabase = drizzle(sqlite);
