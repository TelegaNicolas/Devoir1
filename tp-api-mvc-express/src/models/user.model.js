const db = require("../db/db");

class User {
  static async findAll() {
    const { rows } = await db.query(
      "SELECT id, name, age FROM users ORDER BY id"
    );
    return rows;
  }

  static async findById(id) {
    const { rows } = await db.query(
      "SELECT id, name, age FROM users WHERE id = $1",
      [id]
    );
    return rows[0] || null;
  }

  static async createOne({ name, age }) {
    const { rows } = await db.query(
      "INSERT INTO users (name, age) VALUES ($1, $2) RETURNING id, name, age",
      [name.trim(), age]
    );
    return rows[0];
  }

  static async updateOne(id, { name, age }) {
    const { rows } = await db.query(
      `UPDATE users
       SET name = COALESCE($2, name),
           age  = COALESCE($3, age)
       WHERE id = $1
       RETURNING id, name, age`,
      [id, name, age]
    );
    return rows[0] || null;
  }

  static async deleteOne(id) {
    const res = await db.query(
      "DELETE FROM users WHERE id = $1",
      [id]
    );
    return res.rowCount > 0;
  }
}

module.exports = User;
