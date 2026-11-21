const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/auth');
const jobController = require('../controllers/jobController');

router.post('/', optionalAuth, jobController.createJobDescription);
router.get('/', optionalAuth, jobController.getUserJobDescriptions);
router.get('/:id', optionalAuth, jobController.getJobById);
router.delete('/:id', optionalAuth, jobController.deleteJob);

module.exports = router;
