import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Window } from "happy-dom";
import { start_server } from "../src/app.js";

describe("Homework 1 Tests", () => {
  let window;
  let document;
  let app;

  beforeAll(async () => {
    window = new Window({ url: "http://localhost:3000" });
    document = window.document;
    global.window = window;
    global.document = document;

    // Start the server
    app = await start_server();
  });

  afterAll(() => {
    window.close();
    global.window = undefined;
    global.document = undefined;
  });

  it("(5pts) should display products on home page", async () => {
    const res = await app.request("/");
    const html = await res.text();
    document.body.innerHTML = html;

    const productCards = document.querySelectorAll(".product-card");
    expect(productCards.length).toBe(10);
  });

  it("(5pts) should navigate through pages and display products", async () => {
    const res = await app.request("/?page=9");
    const html = await res.text();
    document.body.innerHTML = html;

    const productCards = document.querySelectorAll(".product-card");
    expect(productCards.length).toBe(10);
  });

  it("(5pts) should add a new product and confirm it appears on the page", async () => {
    const formData = new FormData();
    formData.append("name", "Test Example Product");
    formData.append(
      "image_url",
      "http://localhost:3000/public/placeholder.png"
    );

    await app.request("/add", {
      method: "POST",
      body: formData,
    });

    // Function to get the total number of pages
    const getTotalPages = async () => {
      const res = await app.request("/");
      const html = await res.text();
      document.body.innerHTML = html;
      const paginationLinks = document.querySelectorAll(".pagination a");
      const lastPageLink = paginationLinks[paginationLinks.length - 1];
      return parseInt(lastPageLink.textContent);
    };

    // Get the last page number
    const lastPage = await getTotalPages();

    // Fetch the last page
    const res = await app.request(`/?page=${lastPage}`);
    const html = await res.text();
    document.body.innerHTML = html;

    const productNames = Array.from(
      document.querySelectorAll(".product-card h3")
    ).map((el) => el.textContent);

    expect(productNames).toContain("Test Example Product");
  });

  it("(5pts) should delete a product and confirm it is not visible", async () => {
    // First, get the initial page to find a product ID
    let res = await app.request("/");
    let html = await res.text();
    document.body.innerHTML = html;

    const firstProduct = document.querySelector(".product-card");
    const deleteId = firstProduct.querySelector("p").textContent.split(": ")[1];

    // Now delete the product
    const formData = new FormData();
    formData.append("productID", deleteId);

    res = await app.request("/delete", {
      method: "POST",
      body: formData,
    });

    html = await res.text();
    document.body.innerHTML = html;

    const productCards = document.querySelectorAll(".product-card");

    productCards.forEach((card) => {
      const id = card.querySelector("p").textContent.split(": ")[1];
      expect(id).not.toBe(deleteId);
    });
  });

  it("(5pts) should search for a product and display the results", async () => {
    const res = await app.request("/?query=Test");
    const html = await res.text();
    document.body.innerHTML = html;

    const productCards = document.querySelectorAll(".product-card");
    expect(productCards.length).toBeGreaterThan(0);

    productCards.forEach((card) => {
      const productName = card.querySelector("h3").textContent;
      expect(productName.toLowerCase()).toContain("test");
    });
  });
});
