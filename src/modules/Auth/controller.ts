import { eq } from 'drizzle-orm';
import type { Context } from 'hono';
import { sign } from 'hono/jwt';
import { db } from '~/db';
import { users } from './schema';

export const register = async (c: Context) => {
	const body = await c.req.json();

	const exist = (
		await db.select().from(users).where(eq(users.username, body.username))
	)[0];
	if (exist) {
		return c.text('User already exists', 409);
	}

	const id = crypto.randomUUID();
	const password = await Bun.password.hash(body.password);

	await db.insert(users).values({ ...body, id, password });
	return c.body(null, 201);
};

export const login = async (c: Context) => {
	const body = await c.req.json();

	const user = (
		await db.select().from(users).where(eq(users.username, body.username))
	)[0];
	if (!user) return c.text('No such user!', 404);

	const isPasswordMatched = await Bun.password.verify(
		body.password,
		user.password,
	);
	if (!isPasswordMatched) return c.text('Wrong password buddy!', 401);

	const token = await sign({ sub: user.id }, Bun.env.SECRET as string);

	return c.json({ token });
};
