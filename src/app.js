import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { and, count, eq, ilike, asc, like } from "drizzle-orm";
import { Hono } from "hono";
import { html } from "hono/html";
import { db } from "./db.js";
import { product } from "./schema.js";
import { generateHTML } from "./template.js";
import esMain from "es-main";

export const start_server = () => {
  const PORT = process.env.PORT || 3000;
  const app = new Hono();

  function searchPagination(totalPages, currentPage, query) {
    const links = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === currentPage) {
        links.push(html`<span class="active">${i}</span>`);
      } else {
        links.push(html`
          <a href="/?query=${encodeURIComponent(query)}&page=${i}">${i}</a>
        `);
      }
    }
    return links;
  }

  app.get("/public/*", serveStatic({ root: "./" }));

  app.get("/", async (c) => {

    return c.html(
      generateHTML()
    );
  });

  // Delete a product
  app.post("/delete", async (c) => {
    const body = await c.req.parseBody();
  });

  // Create a new product
  app.post("/add", async (c) => {
    const body = await c.req.parseBody();

  });

  serve({ fetch: app.fetch, port: PORT });
  console.log(`Server is running at http://localhost:${PORT}`);
  return app;
};

if (esMain(import.meta)) {
  start_server();
}
