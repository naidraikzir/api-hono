import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { FILETYPES, MAX_FILESIZE, MAX_FILESIZE_MB } from '~/constants';
import { insertBookSchema } from './schema';

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

export const validator = zValidator('form', insertBookRequest, (result, c) => {
	if (!result.success) {
		return c.json(result.error.issues, 400);
	}
});
