const { pool } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

class UserModel {
  static async create({ email, password, full_name }) {
    const uuid = uuidv4();
    const [result] = await pool.execute(
      'INSERT INTO users (uuid, email, password, full_name) VALUES (?, ?, ?, ?)',
      [uuid, email, password, full_name]
    );
    return { id: result.insertId, uuid, email, full_name };
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ? AND is_active = 1 LIMIT 1',
      [email]
    );
    return rows[0] || null;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, uuid, email, full_name, role, created_at FROM users WHERE id = ? AND is_active = 1 LIMIT 1',
      [id]
    );
    return rows[0] || null;
  }

  static async findByUUID(uuid) {
    const [rows] = await pool.execute(
      'SELECT id, uuid, email, full_name, role, created_at FROM users WHERE uuid = ? AND is_active = 1 LIMIT 1',
      [uuid]
    );
    return rows[0] || null;
  }

  static async emailExists(email) {
    const [rows] = await pool.execute(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    return rows.length > 0;
  }
}

module.exports = UserModel;
