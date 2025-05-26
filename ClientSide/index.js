const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static("public"));

app.get("/products", (req, res) => {
  fs.readFile("products.json", "utf8", (err, data) => {
    if (err) {
      res.status(500).json({ error: "Ошибка чтения файла" });
    } else {
      res.json(JSON.parse(data));
    }
  });
});

app.listen(PORT, () => {
  console.log(`Сервер каталога запущен на http://localhost:${PORT}`);
});