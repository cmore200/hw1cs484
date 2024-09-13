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
    //i need to call the db to get the products
    const query = c.req.query("query") || "";
    const page = parseInt(c.req.query("page")) || 1;
    const productsPerPage = 10;

    const totalProducts = await db.select({ count: count() }).from(product);
    const countValue = totalProducts[0].count;
    const totalPages = Math.ceil(countValue / productsPerPage);

    const allProductsQuery = db.select()
      .from(product)
      .where(like(product.name, `%${query}%`))
      .limit(productsPerPage)
      .offset((page - 1) * productsPerPage);
    
    const allProducts = await allProductsQuery.all();

    console.log("Fetched products:", allProducts);
    console.log('Total pages:', totalPages);
    console.log('Current page:', page);
    console.log("query: ", query);

    return c.html(
      generateHTML(
        {
          title: "Store",
          products: allProducts,
          paginationLinks: searchPagination(totalPages, page, query),
          status: allProducts.length ? "" : "No products found",
          query: query,
        }
      )
    );
  });
  
  // Delete a product
  app.post("/delete", async (c) => {
    const body = await c.req.parseBody();
    const { productID } = body;
  
    if (!productID) {
      return c.redirect("/?error=Product ID is required");
    }
  
    const result = await db.update(product)
      .set({ deleted: 1 })
      .where(eq(product.id, productID));
  
    if (result === 0) {
      return c.redirect("/?error=Product not found");
    }
  
    return c.redirect("/?success=Product deleted successfully");
  });
  

  // Create a new product
  app.post("/add", async (c) => {
    const body = await c.req.parseBody();
    const { name, image_url } = body;

    if (!name || !image_url) {
      return c.redirect("/?error=Name and image URL are required");
    }

    await db.insert(product).values({
      name,
      image_url,
      deleted: 0
    });
    return c.redirect("/?success=Product added successfully");
  });

  serve({ fetch: app.fetch, port: PORT });
  console.log(`Server is running at http://localhost:${PORT}`);
  return app;
};

if (esMain(import.meta)) {
  start_server();
}
