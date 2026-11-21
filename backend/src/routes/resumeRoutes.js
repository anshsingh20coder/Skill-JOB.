const express = require('express');
const router = express.Router();
const { upload, uploadResume, getResumes, getResumeById, deleteResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/upload', upload.single('resume'), uploadResume);
router.get('/', getResumes);
router.get('/:id', getResumeById);
router.delete('/:id', deleteResume);

module.exports = router;
