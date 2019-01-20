const AWS = require('aws-sdk');
const compression = require('compression');
const Consumer = require('sqs-consumer');
const express = require('express');
const http = require('http');
const path = require('path');
const redis = require('socket.io-redis');
const socketIo = require('socket.io');
const uuidv4 = require('uuid/v4');

const app = express();
app.use(compression());

const server = http.createServer(app);
const io = socketIo(server);

io.adapter(redis({ host: process.env.REDIS_CLUSTER_ENDPOINT, port: 6379 }));

app.use(express.static(path.join(__dirname, 'public')));

const batch = new AWS.Batch({ apiVersion: '2016-08-10' });
const s3 = new AWS.S3();

io.on('connection', socket => {
  socket.on('TRANSFER_STYLE', async (data, callback) => {
    const style = 'starry-night';
    const contentKey = 'public/input/test.jpg';

    const jobName = uuidv4();
    const requestId = `${socket.id}::${jobName}`;
    try {
      await batch
        .submitJob({
          jobDefinition: process.env.BATCH_JOB_START_DEFINITION,
          jobName,
          jobQueue: process.env.BATCH_JOB_START_QUEUE_ARN,
          parameters: {
            contentKey,
            requestId,
            style,
          },
        })
        .promise();
      callback(null, { requestId: jobName });
    } catch (error) {
      console.error(error);
      callback(error);
    }
  });

  socket.on('LIST_IMAGES', async callback => {
    try {
      const objects = await s3.listObjectsV2({
        Bucket: process.env.IMAGE_BUCKET_NAME,
        Prefix: 'style/',
      });
      const names = objects.Contents.map(object => object.Key);
      callback(null, names);
    } catch (error) {
      console.error(error);
      callback(error);
    }
  });

  socket.on('LIST_IMAGES', async callback => {
    try {
      const objects = await s3.listObjectsV2({
        Bucket: process.env.IMAGE_BUCKET_NAME,
        Prefix: 'public/output/',
      });
      const names = objects.Contents.map(object => object.Key);
      callback(null, names);
    } catch (error) {
      console.error(error);
      callback(error);
    }
  });
});

const sqs = Consumer.create({
  queueUrl: process.env.BATCH_JOB_DONE_URL,
  handleMessage: message => {
    console.log(message);
    const { requestId, resultKey } = message;
    const [socketId, jobName] = requestId.split('::');
    const result = `${process.env.IMAGE_BUCKET_URL}/${resultKey}`;
    io.to(socketId).emit('TRANSFER_STYLE_COMPLETED', {
      requestId: jobName,
      result,
    });
  },
});

sqs.start();

server.listen(80, () => {
  console.log('Server listening at port %d', 80);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down server');
  server.close();
  sqs.stop();
  process.exit(0);
});
