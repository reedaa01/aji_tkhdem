const { pool } = require('../config/db');

class ProjectModel {
  static async findByUserId(user_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC',
      [user_id]
    );
    return rows;
  }

  static async findById(id, user_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM projects WHERE id=? AND user_id=? LIMIT 1',
      [id, user_id]
    );
    return rows[0] || null;
  }

  static async create(user_id, data) {
    const { title, description, tech_stack, project_url, github_url } = data;
    const [result] = await pool.execute(
      `INSERT INTO projects (user_id, title, description, tech_stack, project_url, github_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, title, description, tech_stack, project_url, github_url]
    );
    return this.findById(result.insertId, user_id);
  }

  static async update(id, user_id, data) {
    const { title, description, tech_stack, project_url, github_url } = data;
    const [result] = await pool.execute(
      `UPDATE projects SET title=?, description=?, tech_stack=?, project_url=?, github_url=?
       WHERE id=? AND user_id=?`,
      [title, description, tech_stack, project_url, github_url, id, user_id]
    );
    return result.affectedRows > 0;
  }

  static async updateImage(id, user_id, image_url) {
    await pool.execute(
      'UPDATE projects SET image_url=? WHERE id=? AND user_id=?',
      [image_url, id, user_id]
    );
  }

  static async delete(id, user_id) {
    const [result] = await pool.execute(
      'DELETE FROM projects WHERE id=? AND user_id=?',
      [id, user_id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = ProjectModel;
