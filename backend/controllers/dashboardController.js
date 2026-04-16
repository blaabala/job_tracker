const db = require('../config/db');

const getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Total count per status
    const [statusCounts] = await db.query(
      `SELECT status, COUNT(*) as count 
       FROM applications 
       WHERE user_id = ? 
       GROUP BY status`,
      [userId]
    );

    // Total applications
    const [totalResult] = await db.query(
      `SELECT COUNT(*) as total 
       FROM applications 
       WHERE user_id = ?`,
      [userId]
    );

    // Applications per month (last 6 months)
    const [monthly] = await db.query(
    `SELECT 
        DATE_FORMAT(date_applied, '%b %Y') as month,
        COUNT(*) as count
    FROM applications
    WHERE user_id = ? 
        AND date_applied >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
    GROUP BY DATE_FORMAT(date_applied, '%Y-%m'), DATE_FORMAT(date_applied, '%b %Y')
    ORDER BY DATE_FORMAT(date_applied, '%Y-%m') ASC`,
    [userId]
    );

    // Overdue follow ups
    const [overdue] = await db.query(
      `SELECT COUNT(*) as count 
       FROM applications 
       WHERE user_id = ? 
         AND follow_up_date < CURDATE()
         AND status NOT IN ('Offer', 'Rejected')`,
      [userId]
    );

    res.json({
      total: totalResult[0].total,
      overdue: overdue[0].count,
      statusCounts,
      monthly
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getStats };