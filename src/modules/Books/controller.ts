import { desc, eq } from 'drizzle-orm';
import { Context } from 'hono';
import { db } from '~/db';
import { books } from './schema';

export const list = async (c: Context) =>
	c.json(await db.select().from(books).orderBy(desc(books.timestamp)));

export const get = async (c: Context) => {
	const book = (
		await db
			.select()
			.from(books)
			.where(eq(books.id, c.req.param('id')))
	).at(0);
	return book ? c.json(book) : c.notFound();
};

export const add = async (c: Context) => {
	const book = await c.req.json();
	const id = crypto.randomUUID();
	const inserted = (
		await db
			.insert(books)
			.values({ ...book, id })
			.returning()
	)[0];
	return c.json(inserted);
};

export const update = async (c: Context) => {
	const existing = (
		await db
			.select()
			.from(books)
			.where(eq(books.id, c.req.param('id')))
	).at(0);
	if (!existing) return c.notFound();
	const book = await c.req.json();
	const updated = (
		await db
			.update(books)
			.set(book)
			.where(eq(books.id, c.req.param('id')))
			.returning()
	)[0];
	return c.json(updated);
};

export const del = async (c: Context) => {
	const existing = (
		await db
			.select()
			.from(books)
			.where(eq(books.id, c.req.param('id')))
	).at(0);
	if (!existing) return c.notFound();
	const deleted = (
		await db
			.delete(books)
			.where(eq(books.id, c.req.param('id')))
			.returning()
	)[0];
	return c.json(deleted);
};
