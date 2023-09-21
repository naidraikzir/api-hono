import { Hono } from 'hono';
import { add, del, get, list, update } from './controller';

const basePath = '/books';

const route = new Hono();
route.get('/', list);
route.get('/:id', get);
route.post('/', add);
route.put('/:id', update);
route.delete('/:id', del);

export { basePath, route };
