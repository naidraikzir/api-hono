import { Hono } from 'hono';
import { login, register } from './controller';

const basePath = '/auth';

const route = new Hono();
route.post('/register', register);
route.post('/login', login);

export { basePath, route };
