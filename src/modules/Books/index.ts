import { Hono } from 'hono';
import { jwt } from '~/middlewares/auth';
import { add, del, get, list, update } from './controller';
import { validator } from './validators';

const basePath = '/books';

const route = new Hono();
route.get('/', list);
route.get('/:id', get);

route.use('/*', jwt);
route.post('/', validator, add);
route.put('/:id', validator, update);
route.delete('/:id', del);

export { basePath, route };
