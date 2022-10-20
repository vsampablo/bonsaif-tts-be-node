require('dotenv').config();
const express = require('express');
const ttsRouter = require('./routers/rss.router.')
const logger = require('./utils/Logger')

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/v1.0', ttsRouter);

app.listen(PORT, () => logger.info(`Running success on port ${PORT}`));

