import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from "@prisma/client";
import { csvDataSchema, analysisRunSchema } from "@future-aura/shared";

const prisma = new PrismaClient();

function sanitizeString(value: string) {
  return value.replace(/[<>]/g, (char) => (char === '<' ? '&lt;' : '&gt;'));
}

interface JWTUser {
  userId: string;
  companyId: string;
  role: string;
}

export async function datasetRoutes(server: FastifyInstance) {
  // RBAC middleware: ensure user is authenticated and in correct company
  const verifyAuth = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (error) {
      reply.status(401).send({ error: "Unauthorized" });
      throw new Error("Unauthorized");
    }
  };

  // POST /api/datasets/upload - Upload CSV dataset
  server.post<{ Body: { name: string; data: string } }>(
    "/datasets/upload",
    async (request, reply) => {
      await verifyAuth(request, reply);
      const user = request.user as JWTUser;

      const body = csvDataSchema.safeParse(request.body);
      if (!body.success) {
        return reply.status(400).send({
          error: "Invalid input",
          details: body.error.errors,
        });
      }

      const { name, data } = body.data;

      try {
        const sanitizedName = sanitizeString(name);
        const sanitizedData = sanitizeString(data);

        // Parse CSV to count rows and extract columns
        const lines = sanitizedData.trim().split("\n");
        const headers = lines[0].split(",").map((h) => h.trim());
        const rowCount = Math.max(0, lines.length - 1); // Exclude header

        // Create dataset in database
        const dataset = await prisma.dataset.create({
          data: {
            name: sanitizedName,
            fileName: `${sanitizedName.replace(/\s+/g, "_")}.csv`,
            fileSize: sanitizedData.length,
            rowCount,
            columns: JSON.stringify(headers),
            data: sanitizedData, // Store CSV data for demo; in production use S3/file storage
            companyId: user.companyId,
          },
        });

        return reply.status(201).send({
          id: dataset.id,
          name: dataset.name,
          fileName: dataset.fileName,
          rowCount: dataset.rowCount,
          columns: headers,
          createdAt: dataset.createdAt,
        });
      } catch (error) {
        server.log.error(error);
        return reply.status(500).send({ error: "Upload failed" });
      }
    }
  );

  // GET /api/datasets - List all datasets for company
  server.get("/datasets", async (request, reply) => {
    await verifyAuth(request, reply);
    const user = request.user as JWTUser;

    try {
      const datasets = await prisma.dataset.findMany({
        where: { companyId: user.companyId },
        select: {
          id: true,
          name: true,
          fileName: true,
          rowCount: true,
          columns: true,
          createdAt: true,
          analyses: {
            select: {
              id: true,
              title: true,
              createdAt: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return datasets;
    } catch (error) {
      server.log.error(error);
      return reply.status(500).send({ error: "Failed to fetch datasets" });
    }
  });

  // DELETE /api/datasets/:id - Delete dataset from the company workspace
  server.delete<{ Params: { id: string } }>(
    "/datasets/:id",
    async (request, reply) => {
      await verifyAuth(request, reply);
      const user = request.user as JWTUser;
      const { id } = request.params;

      try {
        const dataset = await prisma.dataset.findFirst({
          where: {
            id,
            companyId: user.companyId,
          },
        });

        if (!dataset) {
          return reply.status(404).send({ error: 'Dataset not found' });
        }

        await prisma.dataset.delete({ where: { id } });
        return reply.status(204).send();
      } catch (error) {
        server.log.error(error);
        return reply.status(500).send({ error: 'Delete failed' });
      }
    }
  );

  // GET /api/datasets/:id - Get single dataset with analyses
  server.get<{ Params: { id: string } }>(
    "/datasets/:id",
    async (request, reply) => {
      await verifyAuth(request, reply);
      const user = request.user as JWTUser;
      const { id } = request.params;

      try {
        const dataset = await prisma.dataset.findFirst({
          where: {
            id,
            companyId: user.companyId,
          },
          include: {
            analyses: {
              select: {
                id: true,
                title: true,
                description: true,
                summary: true,
                insights: true,
                anomalies: true,
                createdAt: true,
              },
            },
          },
        });

        if (!dataset) {
          return reply.status(404).send({ error: "Dataset not found" });
        }

        return {
          id: dataset.id,
          name: dataset.name,
          fileName: dataset.fileName,
          rowCount: dataset.rowCount,
          columns: JSON.parse(dataset.columns || "[]"),
          createdAt: dataset.createdAt,
          analyses: dataset.analyses.map((a) => ({
            ...a,
            insights: a.insights ? JSON.parse(a.insights) : [],
            anomalies: a.anomalies ? JSON.parse(a.anomalies) : [],
          })),
        };
      } catch (error) {
        server.log.error(error);
        return reply.status(500).send({ error: "Failed to fetch dataset" });
      }
    }
  );

  // POST /api/analysis/run/:datasetId - Run AI analysis on dataset
  server.post<{ Params: { datasetId: string }; Body: { title: string; description?: string } }>(
    "/analysis/run/:datasetId",
    async (request, reply) => {
      await verifyAuth(request, reply);
      const user = request.user as JWTUser;
      const { datasetId } = request.params;

      const body = analysisRunSchema.safeParse({
        datasetId,
        ...request.body,
      });

      if (!body.success) {
        return reply.status(400).send({
          error: "Invalid input",
          details: body.error.errors,
        });
      }

      try {
        // Verify dataset belongs to user's company
        const dataset = await prisma.dataset.findFirst({
          where: {
            id: datasetId,
            companyId: user.companyId,
          },
        });

        if (!dataset) {
          return reply.status(404).send({ error: "Dataset not found" });
        }

        // Mock AI analysis - in production, call actual AI service
        const mockAnalysis = performMockAnalysis(dataset.data || "");

        const analysis = await prisma.analysisResult.create({
          data: {
            title: body.data.title,
            description: body.data.description,
            datasetId,
            summary: mockAnalysis.summary,
            insights: JSON.stringify(mockAnalysis.insights),
            anomalies: JSON.stringify(mockAnalysis.anomalies),
          },
        });

        return reply.status(201).send({
          id: analysis.id,
          title: analysis.title,
          summary: analysis.summary,
          insights: JSON.parse(analysis.insights || "[]"),
          anomalies: JSON.parse(analysis.anomalies || "[]"),
          createdAt: analysis.createdAt,
        });
      } catch (error) {
        server.log.error(error);
        return reply.status(500).send({ error: "Analysis failed" });
      }
    }
  );

  // GET /api/analysis/:id - Get single analysis result
  server.get<{ Params: { id: string } }>(
    "/analysis/:id",
    async (request, reply) => {
      await verifyAuth(request, reply);
      const user = request.user as JWTUser;
      const { id } = request.params;

      try {
        const analysis = await prisma.analysisResult.findFirst({
          where: {
            id,
            dataset: { companyId: user.companyId },
          },
          include: {
            dataset: {
              select: { id: true, name: true },
            },
          },
        });

        if (!analysis) {
          return reply.status(404).send({ error: "Analysis not found" });
        }

        return {
          ...analysis,
          insights: analysis.insights ? JSON.parse(analysis.insights) : [],
          anomalies: analysis.anomalies ? JSON.parse(analysis.anomalies) : [],
        };
      } catch (error) {
        server.log.error(error);
        return reply.status(500).send({ error: "Failed to fetch analysis" });
      }
    }
  );
}

// Mock AI analysis function
function performMockAnalysis(csvData: string) {
  const lines = csvData.split("\n").filter((l) => l.trim());
  const headers = lines[0]?.split(",").map((h) => h.trim()) || [];

  return {
    summary: `Analyzed dataset with ${lines.length - 1} rows and ${headers.length} columns. Key metrics identified: ${headers.slice(0, 3).join(", ")}.`,
    insights: [
      {
        type: "statistical",
        title: "Data Distribution",
        description: "Dataset shows normal distribution across numerical columns",
        confidence: 0.85,
      },
      {
        type: "pattern",
        title: "Temporal Trends",
        description: "Clear upward trend detected in aggregate metrics over time",
        confidence: 0.72,
      },
      {
        type: "correlation",
        title: "Variable Relationships",
        description: "Strong positive correlation found between key metrics",
        confidence: 0.78,
      },
    ],
    anomalies: [
      {
        type: "outlier",
        title: "Unusual Value Detected",
        description: "Row 42 contains value 3 standard deviations from mean",
        severity: "medium",
        affectedColumn: headers[1] || "unknown",
      },
      {
        type: "missing_data",
        title: "Data Gaps",
        description: "2 missing values found in secondary metrics",
        severity: "low",
        affectedColumn: headers[2] || "unknown",
      },
    ],
  };
}
