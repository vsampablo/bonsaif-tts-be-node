require('dotenv').config();
const express = require('express');
const ttsRouter = require('./routers/services')
const {utl}       = require('bonsaif');
const cluster     = require('cluster');
const totalCPUs   = require("os").cpus().length;

const tag = 'tts';

const app = express();

const PORT = process.env.PORT || 8806;

app.use(express.json());

app.use('/', ttsRouter);

//app.listen(PORT, () => utl.log(`Running success on port ${PORT}`));

if (cluster.isMaster) {
    console.log(`${tag} Number of CPUs is ${totalCPUs}  Master ${process.pid} is running.`);
    for (let i = 0; i < totalCPUs; i++) {
      cluster.fork();
    }
   
    cluster.on("exit", (worker, code, signal) => {
      console.log(`${tag} worker ${worker.process.pid} died, ${tag} Let's fork another worker!`);
      cluster.fork();
    });
  } else {
    app.listen(PORT, () => {
      utl.log(`Server listening ${tag} on port ${PORT} pid [${process.pid}] `);
    });
  }

