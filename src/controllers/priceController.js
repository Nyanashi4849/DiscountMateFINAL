const priceModel = require("../models/priceHistoryModel");
const predictionService = require("../services/predictionService");
const pool = require("../config/db");

exports.addPriceHistory = async (productId, price) => {

  const result = await pool.query(
    `INSERT INTO price_history(product_id, price)
     VALUES($1,$2)
     RETURNING *`,
    [productId, price]
  );

  return result.rows[0];
};

exports.updatePrice = async (req, res) => {

  try {

    const { product_id, price } = req.body;

    const result = await priceModel.addPrice(product_id, price);

    res.status(201).json(result);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }
};

exports.getPriceHistory = async (req, res) => {

  try {

    const history = await priceModel.getPriceHistory(req.params.product_id);

    res.json(history);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }
};