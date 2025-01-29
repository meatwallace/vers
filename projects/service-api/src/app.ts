import { Hono } from 'hono';
import { type HttpBindings } from '@hono/node-server';

export const app = new Hono<{ Bindings: HttpBindings }>();
