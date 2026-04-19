const db = require("../config/db");

exports.getAllProducts = async () => {

  const result = await db.query("SELECT * FROM products ORDER BY id");

  return result.rows;

};

exports.createProduct = async (name, store, category, price) => {

  const result = await db.query(

    `INSERT INTO products(name, store, category, current_price)
     VALUES($1,$2,$3,$4)
     RETURNING *`,

    [name, store, category, price]

  );

  return result.rows[0];

};



exports.getProductById = async (id) => {

  const result = await db.query(

    "SELECT * FROM products WHERE id=$1",

    [id]

  );

  return result.rows[0];

};

exports.deleteProduct = async (id) => {

  await db.query(

    "DELETE FROM products WHERE id=$1",

    [id]

  );

};

