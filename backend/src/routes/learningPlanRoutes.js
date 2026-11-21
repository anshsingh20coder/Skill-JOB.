const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/auth');
const learningPlanController = require('../controllers/learningPlanController');

router.get('/:id', optionalAuth, learningPlanController.getLearningPlan);
router.patch('/:id/toggle-day', optionalAuth, learningPlanController.updateDayProgress);

module.exports = router;
