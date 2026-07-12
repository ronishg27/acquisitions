import { logger } from '#config';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authRoutes } from '#routes';
import { securityMiddleware } from '#middleware';

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

app.use(securityMiddleware);

app.get('/', (req, res) => {
  logger.info('Received request for / endpoint');
  res.status(200).send('Hello, World!');
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'Acquisition API v1 is running',
  });
});

app.use('/api/v1/auth', authRoutes);

export default app;
