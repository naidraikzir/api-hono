import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/bun';
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
