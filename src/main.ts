import { Hono } from "hono";
import { serve } from "@hono/node-server";
import * as dotenv from "dotenv";
import ContactController from "./controllers/ContactController";

const app = new Hono();
dotenv.config();

app.post('/contact', ContactController.index);

serve({
    fetch: app.fetch,
    port: 8080,
});
