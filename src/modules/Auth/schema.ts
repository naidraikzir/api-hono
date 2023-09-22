import { sql } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const users = sqliteTable('users', {
	id: text('id').primaryKey(),
	username: text('username').unique(),
	password: text('password'),
	timestamp: text('timestamp').default(sql`CURRENT_TIMESTAMP`),
});

export type User = typeof users.$inferSelect;

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
