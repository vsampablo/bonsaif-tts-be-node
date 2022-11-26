require('dotenv').config();
const express = require('express');
const ttsRouter = require('./routers/services')
const {utl}       = require('bonsaif');

const app = express();

const PORT = process.env.PORT || 8806;

app.use(express.json());

app.use('/', ttsRouter);

app.listen(PORT, () => utl.log(`Running success on port ${PORT}`));

