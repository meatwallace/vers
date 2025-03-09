import { type HttpBindings } from '@hono/node-server';
import { Hono } from 'hono';

type Bindings = HttpBindings;

export const app = new Hono<{ Bindings: Bindings }>();
