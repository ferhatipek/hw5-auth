import express from 'express';
import { pinoHttp } from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { env } from './utils/env.js';
import authRouter from './routers/auth.js';

import contactRouter from './routers/contactsRouters.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

const setupServer = () => {
  const app = express();
  dotenv.config();
  const PORT = Number(process.env.PORT);

  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());

  app.use(
    pinoHttp({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use('/auth', authRouter);
  app.use('/contacts', contactRouter);

  app.get('/', (req, res) => {
    res.send('Server is running! Token bilgileri ile işleme devam edilebilir.');
  });

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default setupServer;
