const { pool } = require('../config/db');

class ExperienceModel {
  static async findByUserId(user_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM experience WHERE user_id = ? ORDER BY start_date DESC',
      [user_id]
    );
    return rows;
  }

  static async findById(id, user_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM experience WHERE id=? AND user_id=? LIMIT 1',
      [id, user_id]
    );
    return rows[0] || null;
  }

  static async create(user_id, data) {
    const { company, position, description, start_date, end_date, is_current } = data;
    const [result] = await pool.execute(
      `INSERT INTO experience (user_id, company, position, description, start_date, end_date, is_current)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, company, position, description, start_date, end_date || null, is_current ? 1 : 0]
    );
    return this.findById(result.insertId, user_id);
  }

  static async update(id, user_id, data) {
    const { company, position, description, start_date, end_date, is_current } = data;
    const [result] = await pool.execute(
      `UPDATE experience SET company=?, position=?, description=?, start_date=?, end_date=?, is_current=?
       WHERE id=? AND user_id=?`,
      [company, position, description, start_date, end_date || null, is_current ? 1 : 0, id, user_id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id, user_id) {
    const [result] = await pool.execute(
      'DELETE FROM experience WHERE id=? AND user_id=?',
      [id, user_id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = ExperienceModel;
