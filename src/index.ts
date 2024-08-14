import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { routes } from './routes';

const app = new Hono();
app.use('*', logger());
app.use('*', cors());
app.use('/uploads/*', serveStatic({ root: './' }));
app.route('/', routes);

export default {
	port: Bun.env.PORT || 3000,
	fetch: app.fetch,
};
