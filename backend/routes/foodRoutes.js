const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');

router.get('/search', foodController.searchFood);
router.post('/nutrition', foodController.getNutrition);

module.exports = router;
