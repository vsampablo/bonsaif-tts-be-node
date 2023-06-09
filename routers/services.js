const express = require('express');
const convertAudio = require('../controllers/tssController');
//Reproducir Audio
const play = require('../controllers/play');

//Replica de audio en diferentes servers
const linkup = require('../controllers/linkup');

const router = express.Router();

const test = require('../controllers/test');

router
.get('/voice-rss', convertAudio.onGET)
.post('/voice-rss', convertAudio.onPOST)
.get('/play/*', play.onGET)
.post('/linkup',linkup.onPOST)
.get('/test',test.onGET);
;

module.exports = router;