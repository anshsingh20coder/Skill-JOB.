const express = require('express');
const router = express.Router();
const {
  createJobDescription,
  getJobDescriptions,
  getJobDescriptionById,
  deleteJobDescription,
} = require('../controllers/jobDescriptionController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', createJobDescription);
router.get('/', getJobDescriptions);
router.get('/:id', getJobDescriptionById);
router.delete('/:id', deleteJobDescription);

module.exports = router;
