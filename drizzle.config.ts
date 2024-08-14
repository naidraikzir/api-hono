import type { Config } from 'drizzle-kit';
import { DB_NAME } from './src/constants';

export default {
	schema: './src/**/schema.ts',
	out: './drizzle',
	dialect: 'sqlite',
	dbCredentials: {
		url: `./${DB_NAME}`,
	},
} satisfies Config;
