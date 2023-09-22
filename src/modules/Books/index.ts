import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { add, del, get, list, update } from './controller';
import { insertBookSchema } from './schema';

const basePath = '/books';

const insertBookRequest = insertBookSchema.pick({
	name: true,
	author: true,
});

const validator = zValidator('json', insertBookRequest, (result, c) => {
	if (!result.success) {
		return c.json(result.error.issues, 400);
	}
});

const route = new Hono();
route.get('/', list);
route.get('/:id', get);
route.post('/', validator, add);
route.put('/:id', validator, update);
route.delete('/:id', del);

export { basePath, route };
