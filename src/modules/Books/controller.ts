import { unlink } from 'node:fs/promises';
import { desc, eq } from 'drizzle-orm';
import type { Context } from 'hono';
import sharp from 'sharp';
import { UPLOAD_DIR } from '~/constants';
import { db } from '~/db';
import { type Book, books } from './schema';

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
	const body = await c.req.parseBody();
	const { name, author, cover } = body;
	const id = crypto.randomUUID();
	const coverFilename = await saveCover(cover as Blob);

	const inserted = (
		await db
			.insert(books)
			.values({
				id,
				name: name as string,
				author: author as string,
				cover: coverFilename,
			})
			.returning()
	).at(0);

	return c.json(inserted);
};

export const update = async (c: Context) => {
	const { id } = c.req.param();
	const exist = (await db.select().from(books).where(eq(books.id, id))).at(0);

	if (!exist) return c.notFound();

	const body = await c.req.parseBody();
	const { name, author, cover } = body;
	const coverFilename = await saveCover(cover as Blob);

	const updated = (
		await db
			.update(books)
			.set({
				name: name as string,
				author: author as string,
				cover: coverFilename,
			})
			.where(eq(books.id, id))
			.returning()
	).at(0);

	deleteCover(exist);
	return c.json(updated);
};

export const del = async (c: Context) => {
	const exist = (
		await db
			.select()
			.from(books)
			.where(eq(books.id, c.req.param('id')))
	).at(0);

	if (!exist) return c.notFound();

	const deleted = (
		await db
			.delete(books)
			.where(eq(books.id, c.req.param('id')))
			.returning()
	).at(0);

	deleteCover(deleted);
	return c.json(deleted);
};

async function saveCover(cover: Blob) {
	if (!cover) return;
	const arrayBuffer = await cover.arrayBuffer();
	const filename = `${crypto.randomUUID()}.webp`;
	await sharp(arrayBuffer).webp().toFile(`uploads/${filename}`);
	return filename;
}

async function deleteCover(book: Book | undefined) {
	if (!book) return;
	const cover = `${UPLOAD_DIR}/${book.cover}`;
	if (book.cover && (await Bun.file(cover).exists())) {
		unlink(`${UPLOAD_DIR}/${book.cover}`);
	}
}
