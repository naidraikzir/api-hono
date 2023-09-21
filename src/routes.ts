import { globSync } from 'glob';
import { Hono } from 'hono';

const files = globSync(`${import.meta.dir}/modules/*/index.ts`);
const modules = [];
for (let index = 0; index < files.length; index++) {
	const module = await import(files[index]);
	modules.push(module);
}
const resolved = await Promise.all(modules);

const routes = new Hono();
for (let index = 0; index < resolved.length; index++) {
	routes.route(resolved[index].basePath, resolved[index].route);
}

export { routes };
