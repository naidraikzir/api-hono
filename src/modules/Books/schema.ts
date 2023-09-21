import { sql } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const books = sqliteTable('books', {
	id: text('id').primaryKey(),
	name: text('name'),
	author: text('author'),
	timestamp: text('timestamp').default(sql`CURRENT_TIMESTAMP`),
});

export type Book = typeof books.$inferSelect;
