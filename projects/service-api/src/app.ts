import type { HttpBindings } from '@hono/node-server';
import { Hono } from 'hono';

export const app = new Hono<{ Bindings: HttpBindings }>();
