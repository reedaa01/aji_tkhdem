const { pool } = require('../config/db');

class SkillModel {
  static async findByUserId(user_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM skills WHERE user_id = ? ORDER BY created_at DESC',
      [user_id]
    );
    return rows;
  }

  static async create(user_id, { name, level }) {
    const [result] = await pool.execute(
      'INSERT INTO skills (user_id, name, level) VALUES (?, ?, ?)',
      [user_id, name, level]
    );
    return { id: result.insertId, user_id, name, level };
  }

  static async update(id, user_id, { name, level }) {
    const [result] = await pool.execute(
      'UPDATE skills SET name=?, level=? WHERE id=? AND user_id=?',
      [name, level, id, user_id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id, user_id) {
    const [result] = await pool.execute(
      'DELETE FROM skills WHERE id=? AND user_id=?',
      [id, user_id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = SkillModel;
