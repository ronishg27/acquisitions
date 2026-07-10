import logger from '#config/logger.js';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// import logger from './config/logger.js';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.use(
  morgan('combined', {
    stream: {
      write: message => {
        logger.info(message.trim());
      },
    },
  })
);

app.get('/', (req, res) => {
  logger.info('Received request for / endpoint');
  res.status(200).send('Hello, World!');
});

app.get('/readyz', (req, res) => {
  logger.info('Received request for /readyz endpoint');
  res.status(200).send('OK');
});

app.get('/healthz', (req, res) => {
  logger.info('Received request for /healthz endpoint');
  res.status(200).send('OK');
});

export default app;
