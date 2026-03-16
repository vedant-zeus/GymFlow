const axios = require('axios');
const pool = require('../config/db');

const API_KEY = process.env.USDA_KEY;
const API_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

exports.searchFood = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const response = await axios.get(`${API_BASE_URL}/foods/search`, {
      params: {
        query: query,
        api_key: API_KEY
      }
    });

    res.json(response.data.foods.slice(0, 10));
  } catch (error) {
    console.error('Error searching food:', error.message);
    res.status(500).json({ error: 'Failed to search food' });
  }
};

exports.getNutrition = async (req, res) => {
  try {
    const { fdcId, quantity } = req.body;

    if (!fdcId || !quantity) {
      return res.status(400).json({ error: 'fdcId and quantity are required' });
    }

    // 1. Check cache first
    const [rows] = await pool.query('SELECT * FROM foods_cache WHERE fdcId = ?', [fdcId]);

    if (rows.length > 0) {
      const cached = rows[0];
      const result = {
        calories: (cached.calories / 100) * quantity,
        protein: (cached.protein / 100) * quantity,
        carbs: (cached.carbs / 100) * quantity,
        fat: (cached.fat / 100) * quantity,
        description: cached.description
      };
      return res.json({ ...result, source: 'cache' });
    }

    // 2. If not in cache, fetch from API
    const response = await axios.get(`${API_BASE_URL}/food/${fdcId}`, {
      params: {
        api_key: API_KEY
      }
    });

    const description = response.data.description;
    const nutrients = response.data.foodNutrients;

    // Find specific nutrients
    const protein = nutrients.find(n => n.nutrient.name === "Protein")?.amount || 0;
    const carbs = nutrients.find(n => n.nutrient.name === "Carbohydrate, by difference")?.amount || 0;
    const fat = nutrients.find(n => n.nutrient.name === "Total lipid (fat)")?.amount || 0;
    const calories = nutrients.find(n => n.nutrient.name === "Energy")?.amount || 0;

    // 3. Save to cache
    await pool.query(
      'INSERT INTO foods_cache (fdcId, description, calories, protein, carbs, fat) VALUES (?, ?, ?, ?, ?, ?)',
      [fdcId, description, calories, protein, carbs, fat]
    );

    // 4. Return calculated result
    const result = {
      calories: (calories / 100) * quantity,
      protein: (protein / 100) * quantity,
      carbs: (carbs / 100) * quantity,
      fat: (fat / 100) * quantity,
      description: description
    };

    res.json({ ...result, source: 'api' });
  } catch (error) {
    console.error('Error getting nutrition:', error.message);
    res.status(500).json({ error: 'Failed to get nutrition data' });
  }
};
