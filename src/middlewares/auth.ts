import { jwt as jwtPlugin } from 'hono/jwt';

export const jwt = jwtPlugin({ secret: Bun.env.SECRET as string });
