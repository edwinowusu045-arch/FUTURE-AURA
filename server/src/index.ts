import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { authPlugin } from './auth';
import { healthRoutes } from './routes/health';
import { authRoutes } from './routes/auth';
import { helloRoutes } from './routes/hello';
import { datasetRoutes } from './routes/datasets';

const app = Fastify({ logger: { level: process.env.LOG_LEVEL || 'info' } });

const port = Number(process.env.PORT || 4000);
const origin = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
const jwtSecret = process.env.JWT_SECRET || 'supersecretdevkey';

async function buildServer() {
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'", origin, `ws://${origin.replace(/^https?:\/\//, '')}`],
        fontSrc: ["'self'", 'data:'],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        objectSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  });
  await app.register(cors, {
    origin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });
  await app.register(jwt, { secret: jwtSecret });
  await app.register(rateLimit, {
    max: 90,
    timeWindow: '1 minute',
  });
  await app.register(authPlugin);

  app.addHook('onSend', async (request, reply, payload) => {
    if (typeof payload === 'string') {
      return payload.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    return payload;
  });

  await app.register(swagger as any, {
    routePrefix: '/api/docs-json',
    swagger: {
      info: {
        title: 'AURA API',
        description: 'API documentation for the Future Aura backend service.',
        version: '1.0.0'
      },
      host: `localhost:${port}`,
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json']
    },
    exposeRoute: true
  });

  await app.register(swaggerUi, {
    routePrefix: '/api/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false
    }
  });

  await app.register(healthRoutes, { prefix: '' });
  await app.register(authRoutes, { prefix: '/api' });
  await app.register(datasetRoutes, { prefix: '/api' });
  await app.register(helloRoutes, { prefix: '/api' });

  app.get('/', async () => ({ status: 'running' }));
}

async function startServer() {
  await buildServer();

  try {
    await app.listen({ port, host: '0.0.0.0' });
    app.log.info(`Server listening on http://localhost:${port}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

startServer();
