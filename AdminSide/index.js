const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { graphqlHTTP } = require('express-graphql');
const { schema, root } = require('./graphql/schema');

const app = express();
const PORT = 8080;
const FILE = "/app/Server/products.json";

app.use(cors());
app.use(express.json());

function readProducts() {
  return JSON.parse(fs.readFileSync(FILE, "utf8"));
}

function writeProducts(products) {
  fs.writeFileSync(FILE, JSON.stringify(products, null, 2), "utf8");
}

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.get("/products", (req, res) => {
  res.json(readProducts());
});

app.post("/products", (req, res) => {
  let products = readProducts();
  const newProducts = req.body;
  newProducts.forEach(p => p.id = products.length ? products[products.length - 1].id + 1 : 1);
  products.push(...newProducts);
  writeProducts(products);
  res.status(201).json({ message: "Товары добавлены" });
});

app.put("/products/:id", (req, res) => {
  let products = readProducts();
  let id = parseInt(req.params.id);
  let index = products.findIndex(p => p.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: "Товар не найден" });
  }

  products[index] = { ...products[index], ...req.body };
  writeProducts(products);
  res.json({ message: "Товар обновлён" });
});

app.delete("/products/:id", (req, res) => {
  let products = readProducts();
  let id = parseInt(req.params.id);
  let filtered = products.filter(p => p.id !== id);
  
  if (filtered.length === products.length) {
    return res.status(404).json({ error: "Товар не найден" });
  }

  writeProducts(filtered);
  res.json({ message: "Товар удалён" });
});

app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`Панель администратора запущена на http://localhost:${PORT}/admin.html`);
});

app.get("/", (req, res) => {
  res.send("Admin Panel API is running. Use /admin.html.");
});