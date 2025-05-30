// filepath: Frontend4/AdminSide/graphql/schema.js
const { buildSchema } = require('graphql');
const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../../Server/products.json');

function readProducts() {
  return JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
}

function writeProducts(products) {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf8');
}

const schema = buildSchema(`
  type Product {
    id: Int
    name: String
    price: Float
    description: String
    categories: [String]
  }

  type Query {
    products: [Product]
  }

  type Mutation {
    addProduct(name: String, price: Float, description: String, categories: [String]): Product
    updateProduct(id: Int, name: String, price: Float, description: String, categories: [String]): Product
    deleteProduct(id: Int): Product
  }
`);

const root = {
  products: () => readProducts(),
  addProduct: ({ name, price, description, categories }) => {
    const products = readProducts();
    const id = products.length ? products[products.length - 1].id + 1 : 1;
    const product = { id, name, price, description, categories };
    products.push(product);
    writeProducts(products);
    return product;
  },
  updateProduct: ({ id, name, price, description, categories }) => {
    const products = readProducts();
    const product = products.find(p => p.id === id);
    if (!product) throw new Error('Product not found');
    product.name = name;
    product.price = price;
    product.description = description;
    product.categories = categories;
    writeProducts(products);
    return product;
  },
  deleteProduct: ({ id }) => {
    let products = readProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    const [deletedProduct] = products.splice(index, 1);
    writeProducts(products);
    return deletedProduct;
  }
};

module.exports = { schema, root };