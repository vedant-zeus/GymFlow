const express = require('express');
const router = express.Router();
const prController = require('../controllers/prController');
const verifyToken = require('../middleware/authMiddleware');

// All PR routes require authentication
router.use(verifyToken);

router.get('/', prController.getLatestPRs);
router.post('/', prController.logPR);
router.get('/history/:exerciseId', prController.getPRHistory);

module.exports = router;
