const { pool } = require('../config/db');

class PortfolioModel {
  static async findByUserId(user_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM portfolios WHERE user_id = ? LIMIT 1',
      [user_id]
    );
    return rows[0] || null;
  }

  static async upsert(user_id, data) {
    const { headline, bio, phone, location, website, github, linkedin } = data;
    const existing = await this.findByUserId(user_id);

    if (existing) {
      await pool.execute(
        `UPDATE portfolios 
         SET headline=?, bio=?, phone=?, location=?, website=?, github=?, linkedin=?
         WHERE user_id=?`,
        [headline, bio, phone, location, website, github, linkedin, user_id]
      );
    } else {
      await pool.execute(
        `INSERT INTO portfolios (user_id, headline, bio, phone, location, website, github, linkedin)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [user_id, headline, bio, phone, location, website, github, linkedin]
      );
    }
    return this.findByUserId(user_id);
  }

  static async updateAvatar(user_id, avatar_url) {
    await pool.execute(
      'UPDATE portfolios SET avatar_url=? WHERE user_id=?',
      [avatar_url, user_id]
    );
  }

  static async updateCV(user_id, cv_url) {
    await pool.execute(
      'UPDATE portfolios SET cv_url=? WHERE user_id=?',
      [cv_url, user_id]
    );
  }

  // Ensure portfolio row exists before updating files
  static async ensureExists(user_id) {
    const existing = await this.findByUserId(user_id);
    if (!existing) {
      await pool.execute('INSERT INTO portfolios (user_id) VALUES (?)', [user_id]);
    }
  }
}

module.exports = PortfolioModel;
