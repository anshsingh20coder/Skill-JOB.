const express = require('express');
const router = express.Router();
const {
  runAnalysis,
  getAnalysisHistory,
  getAnalysisById,
  updateLearningPlanDay,
  deleteAnalysis,
  exportAnalysis,
} = require('../controllers/analysisController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/run', runAnalysis);
router.get('/history', getAnalysisHistory);
router.get('/:id', getAnalysisById);
router.patch('/:id/learning-plan/day/:dayNumber', updateLearningPlanDay);
router.delete('/:id', deleteAnalysis);
router.get('/:id/export', exportAnalysis);

module.exports = router;
