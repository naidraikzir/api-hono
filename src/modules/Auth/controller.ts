import { db } from '@/db';
import type { Context } from 'hono';
import { users } from './schema';

export const register = async (c: Context) => {
	const body = await c.req.json();
	const id = crypto.randomUUID();
	const password = await Bun.password.hash(body.password);
	try {
		await db.insert(users).values({ ...body, id, password });
		return c.body(null, 201);
	} catch (error) {
		return c.text('Bad Request', 400);
	}
};

export const login = async (c: Context) =>
	c.json({ ...(await c.req.json()), route: 'login' });
