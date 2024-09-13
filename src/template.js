import { html } from "hono/html";

export function generateHTML({
	title,
	products,
	paginationLinks,
	status,
	query,
}) {
	return html`
    <html>
      <head>
        <title>${title}</title>
        <link rel="stylesheet" href="/public/ProductList.css" />
        <link rel="stylesheet" href="/public/ProductForm.css" />
        <link rel="stylesheet" href="/public/Search.css" />
      </head>
      <body>
        ${status ? html`<p>Status: ${status}</p>` : ""}
        <h1><a href="/">Store</a></h1>
        <div class="product-form-container">
          <h2>Add New Product</h2>
          <form action="/add" method="POST" class="product-form">
            <div class="form-group">
              <label for="name">Name:</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div class="form-group">
              <label for="imageUrl">Image URL:</label>
              <input type="url" id="imageUrl" name="image_url" />
            </div>
            <button type="submit" class="submit-button">Add Product</button>
          </form>
          <h2>Delete Product</h2>
          <form action="/delete" method="POST" class="product-form">
            <div class="form-group">
              <input
                type="text"
                name="productID"
                id="productID"
                placeholder="Enter Product ID"
                required
              />
            </div>
            <button type="submit" class="delete-button">Delete Product</button>
          </form>
        </div>
        <div class="search-container">
          <form action="/" method="GET">
            <input
              type="text"
              id="query"
              name="query"
              value="${query || ""}"
              placeholder="Search products..."
              required
            />
            <button type="submit">Search</button>
          </form>
        </div>
        <div class="product-list">
          <h2>${title}</h2>
          ${
						products.length === 0
							? html`<p>No products found.</p>`
							: html`
                <div class="product-grid">
                  ${products.map(
										(p) => html`
                      <div class="product-card">
                        <img
                          src="${p.image_url || "/public/placeholder.png"}"
                          alt="${p.name}"
                          onerror="this.src='/public/placeholder.png'"
                        />
                        <h3>${p.name}</h3>
                        <p>ID: ${p.id}</p>
                      </div>
                    `,
									)}
                </div>
              `
					}
          <div class="pagination">${paginationLinks}</div>
        </div>
      </body>
    </html>
  `;
}
