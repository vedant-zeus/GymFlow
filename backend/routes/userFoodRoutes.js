const express = require('express');
const router = express.Router();
const userFoodController = require('../controllers/userFoodController');
const verifyToken = require('../middleware/authMiddleware');

// All routes in here are protected by the JWT token verification
router.use(verifyToken);

// POST: Add new food log
router.post('/', userFoodController.addFood);

// GET: Fetch user's food logs
router.get('/', userFoodController.getFoods);

// DELETE: Remove a food log
router.delete('/:id', userFoodController.deleteFood);

module.exports = router;
