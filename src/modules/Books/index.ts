import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import { add, del, get, list, update } from './controller';

const basePath = '/books';

const validator = zValidator(
	'json',
	z.object({
		name: z.string(),
		author: z.string(),
	}),
	(result, c) => {
		if (!result.success) {
			return c.json(result.error, 400);
		}
	},
);

const route = new Hono();
route.get('/', list);
route.get('/:id', get);
route.post('/', validator, add);
route.put('/:id', validator, update);
route.delete('/:id', del);

export { basePath, route };
