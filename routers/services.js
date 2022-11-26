const express = require('express');
const convertAudio = require('../controllers/tssController');
//Reproducir Audio
const play = require('../controllers/play');

//Replica de audio en diferentes servers
const linkup = require('../controllers/linkup');

const router = express.Router();

router
.get('/voice-rss', convertAudio)
.get('/play/*', play.onGET)
.post('/linkup',linkup.onPOST)
;

module.exports = router;