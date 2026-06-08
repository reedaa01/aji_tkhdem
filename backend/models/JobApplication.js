const { pool } = require('../config/db');

class JobApplicationModel {
  static async findByUserId(user_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM job_applications WHERE user_id = ? ORDER BY applied_at DESC',
      [user_id]
    );
    return rows;
  }

  static async findById(id, user_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM job_applications WHERE id=? AND user_id=? LIMIT 1',
      [id, user_id]
    );
    return rows[0] || null;
  }

  static async findByJobAndUser(job_id, user_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM job_applications WHERE job_id=? AND user_id=? LIMIT 1',
      [job_id, user_id]
    );
    return rows[0] || null;
  }

  static async create(user_id, data) {
    const { job_id, job_title, company_name, job_url, location, job_type, notes } = data;
    const [result] = await pool.execute(
      `INSERT INTO job_applications (user_id, job_id, job_title, company_name, job_url, location, job_type, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, job_id, job_title, company_name, job_url || null, location || null, job_type || null, notes || null]
    );
    return this.findById(result.insertId, user_id);
  }

  static async updateStatus(id, user_id, status, notes) {
    const [result] = await pool.execute(
      'UPDATE job_applications SET status=?, notes=? WHERE id=? AND user_id=?',
      [status, notes || null, id, user_id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id, user_id) {
    const [result] = await pool.execute(
      'DELETE FROM job_applications WHERE id=? AND user_id=?',
      [id, user_id]
    );
    return result.affectedRows > 0;
  }

  static async getStats(user_id) {
    const [rows] = await pool.execute(
      `SELECT status, COUNT(*) as count
       FROM job_applications
       WHERE user_id = ?
       GROUP BY status`,
      [user_id]
    );
    const stats = { applied: 0, interview: 0, offer: 0, rejected: 0, withdrawn: 0, total: 0 };
    rows.forEach(r => {
      stats[r.status] = r.count;
      stats.total += Number(r.count);
    });
    return stats;
  }
}

module.exports = JobApplicationModel;
