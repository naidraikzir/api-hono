import type { Context } from 'hono';

export const register = async (c: Context) =>
	c.json({ ...(await c.req.json()), route: 'register' });
export const login = async (c: Context) =>
	c.json({ ...(await c.req.json()), route: 'login' });
