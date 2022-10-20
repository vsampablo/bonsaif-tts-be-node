const express = require('express');
const convertAudio = require('../controllers/tssController');
const router = express.Router();

router.get('/voice-rss', convertAudio);

module.exports = router;