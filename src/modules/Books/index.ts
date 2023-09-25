import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import { FILETYPES, MAX_FILESIZE, MAX_FILESIZE_MB } from '~/constants';
import { jwt } from '~/middlewares/auth';
import { add, del, get, list, update } from './controller';
import { insertBookSchema } from './schema';

const basePath = '/books';

export const insertBookRequest = insertBookSchema
	.pick({
		name: true,
		author: true,
	})
	.and(
		z.object({
			cover: z
				.instanceof(File)
				.refine(val => val.size < MAX_FILESIZE, {
					message: `File too large, max size allowed is ${MAX_FILESIZE_MB}MB`,
				})
				.refine(val => FILETYPES.image.includes(val.type), {
					message: 'Invalid file type',
				})
				.optional(),
		}),
	);

const validator = zValidator('form', insertBookRequest, (result, c) => {
	if (!result.success) {
		return c.json(result.error.issues, 400);
	}
});

const route = new Hono();
route.get('/', list);
route.get('/:id', get);

route.use('/*', jwt);
route.post('/', validator, add);
route.put('/:id', validator, update);
route.delete('/:id', del);

export { basePath, route };
