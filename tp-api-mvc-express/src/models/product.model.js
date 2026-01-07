const db = require("../db/db");

class Product {
  static async findAll() {
    const { rows } = await db.query(
      "SELECT id, name, price FROM products ORDER BY id"
    );
    return rows;
  }

  static async findById(id) {
    const { rows } = await db.query(
      "SELECT id, name, price FROM products WHERE id = $1",
      [id]
    );
    return rows[0] || null;
  }

  static async createOne({ name, price }) {
    const { rows } = await db.query(
      "INSERT INTO products (name, price) VALUES ($1, $2) RETURNING id, name, price",
      [name.trim(), price]
    );
    return rows[0];
  }

  static async updateOne(id, { name, price }) {
    const { rows } = await db.query(
      `UPDATE products
       SET name  = COALESCE($2, name),
           price = COALESCE($3, price)
       WHERE id = $1
       RETURNING id, name, price`,
      [id, name, price]
    );
    return rows[0] || null;
  }

  static async deleteOne(id) {
    const res = await db.query(
      "DELETE FROM products WHERE id = $1",
      [id]
    );
    return res.rowCount > 0;
  }
}

module.exports = Product;
