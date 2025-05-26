const { buildSchema } = require('graphql');
const fs = require('fs');
const path = require('path');

// Read products from products.json
const productsFilePath = path.join(__dirname, '../../Server/products.json');
const productsData = fs.readFileSync(productsFilePath);
const products = JSON.parse(productsData);

const schema = buildSchema(`
  type Product {
    id: Int
    name: String
    price: Float
    categories: [String]
  }

  type Query {
    products: [Product]
  }

  type Mutation {
    addProduct(name: String, price: Float, categories: [String]): Product
    updateProduct(id: Int, name: String, price: Float, categories: [String]): Product
    deleteProduct(id: Int): Product
  }
`);

const root = {
  products: () => products,
  addProduct: ({ name, price, categories }) => {
    const product = { id: products.length + 1, name, price, categories };
    products.push(product);
    return product;
  },
  updateProduct: ({ id, name, price, categories }) => {
    const product = products.find(p => p.id === id);
    if (!product) {
      throw new Error('Product not found');
    }
    product.name = name;
    product.price = price;
    product.categories = categories;
    return product;
  },
  deleteProduct: ({ id }) => {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Product not found');
    }
    const [deletedProduct] = products.splice(index, 1);
    return deletedProduct;
  }
};

module.exports = { schema, root };