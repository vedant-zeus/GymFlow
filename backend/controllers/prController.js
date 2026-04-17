const pool = require('../config/db');

// Get the latest PR for each major lift for the current user
exports.getLatestPRs = async (req, res) => {
  const userId = req.user.id;
  try {
    // We want the highest weight for each exercise_id
    const query = `
      SELECT t1.*
      FROM personal_records t1
      INNER JOIN (
          SELECT exercise_id, MAX(weight) as max_weight
          FROM personal_records
          WHERE user_id = ?
          GROUP BY exercise_id
      ) t2 ON t1.exercise_id = t2.exercise_id AND t1.weight = t2.max_weight
      WHERE t1.user_id = ?
      ORDER BY logged_at DESC
    `;
    
    // Note: If there are duplicate max weights for the same exercise, this might return multiple rows.
    // We'll further group them in JS to ensure only one per exercise_id.
    const [rows] = await pool.query(query, [userId, userId]);
    
    // Ensure uniqueness per exercise_id (keep the most recent one if weights are tied)
    const uniquePRs = {};
    rows.forEach(row => {
      if (!uniquePRs[row.exercise_id] || new Date(row.logged_at) > new Date(uniquePRs[row.exercise_id].logged_at)) {
        uniquePRs[row.exercise_id] = row;
      }
    });

    res.json(Object.values(uniquePRs));
  } catch (err) {
    console.error('Error fetching PRs:', err);
    res.status(500).json({ error: 'Failed to fetch personal records.' });
  }
};

// Log a new PR
exports.logPR = async (req, res) => {
  const userId = req.user.id;
  const { exercise_id, exercise_name, weight, unit, notes } = req.body;

  if (!exercise_id || !weight) {
    return res.status(400).json({ error: 'Exercise and weight are required.' });
  }

  try {
    await pool.query(
      'INSERT INTO personal_records (user_id, exercise_id, exercise_name, weight, unit, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, exercise_id, exercise_name, weight, unit || 'KG', notes || '']
    );
    res.status(201).json({ message: 'Personal record logged successfully.' });
  } catch (err) {
    console.error('Error logging PR:', err);
    res.status(500).json({ error: 'Failed to log personal record.' });
  }
};

// Get PR history for a specific exercise grouped by month
exports.getPRHistory = async (req, res) => {
  const userId = req.user.id;
  const { exerciseId } = req.params;

  try {
    // Get the max weight for each month
    const query = `
      SELECT 
        DATE_FORMAT(logged_at, '%b') as month,
        MAX(weight) as max_weight
      FROM personal_records
      WHERE user_id = ? AND exercise_id = ?
      GROUP BY DATE_FORMAT(logged_at, '%Y-%m'), month
      ORDER BY MIN(logged_at) ASC
      LIMIT 12
    `;
    const [rows] = await pool.query(query, [userId, exerciseId]);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching PR history:', err);
    res.status(500).json({ error: 'Failed to fetch PR history.' });
  }
};
