const db = require("../config/db");

exports.createAlert = async (user_id, product_id, target_price) => {

  const result = await db.query(

    `INSERT INTO alerts(user_id, product_id, target_price)
     VALUES($1,$2,$3)
     RETURNING *`,

    [user_id, product_id, target_price]

  );

  return result.rows[0];

};

exports.getAllAlerts = async () => {

  const result = await db.query(

    `SELECT *
     FROM alerts
     ORDER BY id`

  );

  return result.rows;

};