const express = require("express");
const router = express.Router();

const {
  getProducts,
  createProduct,
  getProductById,
  deleteProduct
} = require("../controllers/productController");

router.get("/", getProducts);

router.post("/", createProduct);

router.get("/:id", getProductById);

router.delete("/:id", deleteProduct);

module.exports = router;