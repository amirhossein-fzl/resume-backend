import { Hono } from "hono";
import { serve } from "@hono/node-server";
import * as dotenv from "dotenv";
import ContactController from "./controllers/ContactController";
import { cors } from 'hono/cors';

const app = new Hono();
dotenv.config();

app.use('*', cors({
    origin: 'https://amirhossein-fzl-dev.ir'
}))
app.post('/contact', ContactController.index);

serve({
    fetch: app.fetch,
    port: 8080,
});
