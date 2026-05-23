import { FastifyInstance } from 'fastify';

export async function helloRoutes(server: FastifyInstance) {
  server.get('/hello', { preValidation: [server.authenticate] }, async (request, reply) => {
    const user = request.user as { email: string; role: string } | undefined;
    return {
      message: 'Welcome to AURA API',
      user: user ?? null,
      timestamp: new Date().toISOString()
    };
  });
}
