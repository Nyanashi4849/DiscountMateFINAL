const db = require("../config/db");

exports.addPrice = async (product_id, price) => {

  const result = await db.query(

    `INSERT INTO price_history(product_id, price)
     VALUES($1,$2)
     RETURNING *`,

    [product_id, price]

  );

  await db.query(

    `UPDATE products
     SET current_price=$1
     WHERE id=$2`,

    [price, product_id]

  );

  return result.rows[0];

};

exports.getPriceHistory = async (product_id) => {

  const result = await db.query(

    `SELECT *
     FROM price_history
     WHERE product_id=$1
     ORDER BY recorded_at DESC`,

    [product_id]

  );

  return result.rows;

};