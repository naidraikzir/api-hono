import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { login, register } from './controller';
import { insertUserSchema } from './schema';

const basePath = '/auth';

const insertUserRequest = insertUserSchema.pick({
	username: true,
	password: true,
});

const validator = zValidator('json', insertUserRequest, (result, c) => {
	if (!result.success) {
		return c.json(result.error.issues, 400);
	}
});

const route = new Hono();
route.post('/register', validator, register);
route.post('/login', validator, login);

export { basePath, route };
