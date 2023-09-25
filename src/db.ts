import { BunSQLiteDatabase, drizzle } from 'drizzle-orm/bun-sqlite';
import { DB_NAME } from './constants';
import { Database } from 'bun:sqlite';

const sqlite = new Database(DB_NAME);
export const db: BunSQLiteDatabase = drizzle(sqlite);
