import { zValidator } from '@hono/zod-validator';
import { insertUserSchema } from './schema';

const insertUserRequest = insertUserSchema.pick({
	username: true,
	password: true,
});

export const validator = zValidator('json', insertUserRequest, (result, c) => {
	if (!result.success) {
		return c.json(result.error.issues, 400);
	}
});
