// const productModel = require("../models/productModel");

// exports.getProducts = async (req, res) => {
//   try {
//     const products = await productModel.getAllProducts();
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.createProduct = async (req, res) => {
//   try {
//     const { name, store, category, current_price } = req.body;

//     const product = await productModel.createProduct(
//       name,
//       store,
//       category,
//       current_price
//     );

//     res.status(201).json(product);

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.getProductById = async (req, res) => {
//   try {

//     const product = await productModel.getProductById(req.params.id);

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     res.json(product);

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.deleteProduct = async (req, res) => {
//   try {

//     await productModel.deleteProduct(req.params.id);

//     res.json({ message: "Product deleted" });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


const productModel = require("../models/productModel");
const priceHistoryModel = require("../models/priceHistoryModel");

exports.getProducts = async (req, res) => {
  try {
    const products = await productModel.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, store, category, current_price } = req.body;

    // create product
    const product = await productModel.createProduct(
      name,
      store,
      category,
      current_price
    );

    // save first price in price_history
    await priceHistoryModel.addPriceHistory(
      product.id,
      current_price
    );

    res.status(201).json(product);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {

    const product = await productModel.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {

    await productModel.deleteProduct(req.params.id);

    res.json({ message: "Product deleted" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};