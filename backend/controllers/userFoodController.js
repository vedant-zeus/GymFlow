const pool = require('../config/db');

// @route   POST /user-foods
// @desc    Add a logged food to the user's specific database table
exports.addFood = async (req, res) => {
  try {
    const userId = req.user.id; // Extracted from JWT middleware
    const { fdcId, title, portion, category, calories, protein, carbs, fat } = req.body;

    if (!fdcId || !title || !category) {
      return res.status(400).json({ error: 'Please provide all required food fields' });
    }

    const [result] = await pool.query(
      `INSERT INTO user_foods 
        (user_id, fdcId, title, portion, category, calories, protein, carbs, fat) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, fdcId, title, portion, category, calories, protein, carbs, fat]
    );

    res.status(201).json({ 
      message: 'Food logged successfully', 
      id: result.insertId 
    });
  } catch (error) {
    console.error('Error logging food:', error);
    res.status(500).json({ error: 'Server error saving logged food' });
  }
};

// @route   GET /user-foods
// @desc    Get all active food logs for the authenticated user
exports.getFoods = async (req, res) => {
  try {
    const userId = req.user.id;

    const [foods] = await pool.query(
      `SELECT * FROM user_foods WHERE user_id = ? ORDER BY logged_at DESC`,
      [userId]
    );

    res.json(foods);
  } catch (error) {
    console.error('Error fetching user foods:', error);
    res.status(500).json({ error: 'Server error fetching logged foods' });
  }
};

// @route   DELETE /user-foods/:id
// @desc    Delete a specific food log item belonging to the user
exports.deleteFood = async (req, res) => {
  try {
    const userId = req.user.id;
    const foodId = req.params.id;

    // We verify the food belongs to the particular user to prevent manipulation
    const [result] = await pool.query(
      `DELETE FROM user_foods WHERE id = ? AND user_id = ?`,
      [foodId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Food entry not found or unauthorized' });
    }

    res.json({ message: 'Food entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting food:', error);
    res.status(500).json({ error: 'Server error deleting logged food' });
  }
};
