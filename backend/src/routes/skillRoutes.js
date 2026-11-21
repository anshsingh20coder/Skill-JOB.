const express = require('express');
const router = express.Router();
const { getSkillsDictionary, checkSynonym } = require('../controllers/skillController');

router.get('/', getSkillsDictionary);
router.post('/check-synonym', checkSynonym);

module.exports = router;
