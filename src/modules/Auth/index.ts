import { Hono } from 'hono';
import { login, register } from './controller';
import { validator } from './validators';

const basePath = '/auth';

const route = new Hono();
route.post('/register', validator, register);
route.post('/login', validator, login);

export { basePath, route };
