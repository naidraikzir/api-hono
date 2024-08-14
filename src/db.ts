import { Database } from 'bun:sqlite';
import { type BunSQLiteDatabase, drizzle } from 'drizzle-orm/bun-sqlite';
import { DB_NAME } from './constants';

const sqlite = new Database(DB_NAME);
export const db: BunSQLiteDatabase = drizzle(sqlite);
