const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.post("/", async (req, res) => {

 const { user_id, product_id, target_price } = req.body;

 const result = await pool.query(
  "INSERT INTO alerts(user_id, product_id, target_price) VALUES($1,$2,$3) RETURNING *",
  [user_id, product_id, target_price]
 );

 res.json(result.rows[0]);

});

module.exports = router;