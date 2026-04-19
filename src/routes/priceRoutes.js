const express = require("express");
const router = express.Router();

const {
  updatePrice,
  getPriceHistory
} = require("../controllers/priceController");

router.post("/update", updatePrice);

router.get("/history/:product_id", getPriceHistory);

module.exports = router;