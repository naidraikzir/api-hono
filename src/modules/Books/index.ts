import { fileTypeFromBlob } from 'file-type';
import { Context, Hono, Next } from 'hono';
import { z } from 'zod';
import { jwt } from '~/middlewares/auth';
import { add, del, get, list, update } from './controller';
import { insertBookSchema } from './schema';

const basePath = '/books';

export const insertBookRequest = insertBookSchema
	.pick({
		name: true,
		author: true,
	})
	.and(z.object({ cover: z.instanceof(File).optional() }));

const validator = async (c: Context, next: Next) => {
	const body = await c.req.parseBody();
	const result = insertBookRequest.safeParse(body);

	if (!result.success) {
		return c.json(result.error.issues, 400);
	}

	const { cover } = result.data;
	if (cover) {
		const filetype = await fileTypeFromBlob(cover as Blob);
		if (!filetype) {
			return c.text('Invalid cover file', 400);
		}
	}

	await next();
};

const route = new Hono();
route.get('/', list);
route.get('/:id', get);

route.use('/*', jwt);
route.post('/', validator, add);
route.put('/:id', validator, update);
route.delete('/:id', del);

export { basePath, route };
