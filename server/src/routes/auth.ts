import { FastifyInstance } from "fastify";
import { loginSchema, registerSchema } from "@future-aura/shared";
import * as bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function sanitizeString(value: string) {
  return value.replace(/[<>]/g, (char) => (char === '<' ? '&lt;' : '&gt;'));
}

export async function authRoutes(server: FastifyInstance) {
  // Register new user
  server.post("/auth/register", async (request, reply) => {
    const body = registerSchema.safeParse(request.body);

    if (!body.success) {
      return reply.status(400).send({
        error: "Invalid input",
        details: body.error.errors,
      });
    }

    const { email, password, firstName, lastName, companyName } = body.data;

    try {
      const sanitizedEmail = sanitizeString(email.toLowerCase());
      const sanitizedFirstName = sanitizeString(firstName);
      const sanitizedLastName = sanitizeString(lastName);
      const sanitizedCompanyName = sanitizeString(companyName);

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: sanitizedEmail },
      });

      if (existingUser) {
        return reply.status(400).send({ error: "User already exists" });
      }

      // Find or create company for onboarding
      let company = await prisma.company.findUnique({
        where: { name: sanitizedCompanyName },
      });

      if (!company) {
        company = await prisma.company.create({
          data: { name: sanitizedCompanyName },
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          email: sanitizedEmail,
          password: hashedPassword,
          firstName: sanitizedFirstName,
          lastName: sanitizedLastName,
          companyId: company.id,
          role: "analyst",
        },
      });

      const token = server.jwt.sign({
        userId: user.id,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      });

      return reply.status(201).send({
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      });
    } catch (error) {
      server.log.error(error);
      return reply.status(500).send({ error: "Registration failed" });
    }
  });

  // Login endpoint
  server.post("/auth/login", async (request, reply) => {
    const body = loginSchema.safeParse(request.body);

    if (!body.success) {
      return reply.status(400).send({
        error: "Email and password are required",
      });
    }

    const { email, password } = body.data;

    try {
      const sanitizedEmail = sanitizeString(email.toLowerCase());
      const user = await prisma.user.findUnique({
        where: { email: sanitizedEmail },
      });

      if (!user) {
        return reply.status(401).send({ error: "Invalid credentials" });
      }

      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return reply.status(401).send({ error: "Invalid credentials" });
      }

      // Generate JWT
      const token = server.jwt.sign({
        userId: user.id,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      });

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      };
    } catch (error) {
      server.log.error(error);
      return reply.status(500).send({ error: "Login failed" });
    }
  });

  // Get current user profile
  server.get("/auth/me", async (request, reply) => {
    try {
      await request.jwtVerify();
      const userId = (request.user as any).userId;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          companyId: true,
          company: {
            select: { id: true, name: true },
          },
        },
      });

      if (!user) {
        return reply.status(404).send({ error: "User not found" });
      }

      return user;
    } catch (error) {
      return reply.status(401).send({ error: "Unauthorized" });
    }
  });
}
