import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import { login, register } from './controller';

const basePath = '/auth';

const validator = zValidator(
	'json',
	z.object({
		username: z.string(),
		password: z.string(),
	}),
	(result, c) => {
		if (!result.success) {
			return c.json(result.error, 400);
		}
	},
);

const route = new Hono();
route.post('/register', validator, register);
route.post('/login', validator, login);

export { basePath, route };
