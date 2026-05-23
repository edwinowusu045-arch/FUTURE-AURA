# Base image for building the Next.js app
FROM node:20-alpine AS builder
WORKDIR /app

# Copy root workspace manifest first
COPY package.json package-lock.json* ./

# Copy all workspace package.json files so npm can resolve the full dependency tree
COPY next-app/package.json ./next-app/package.json
COPY server/package.json ./server/package.json
COPY packages/shared/package.json ./packages/shared/package.json

# Install all workspace dependencies (including the `next` CLI)
RUN npm install

# Copy the rest of the source and build
COPY . .
RUN npm run build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Root workspace files
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# next-app workspace — built output and runtime files
COPY --from=builder /app/next-app/.next ./next-app/.next
COPY --from=builder /app/next-app/next.config.mjs ./next-app/next.config.mjs
COPY --from=builder /app/next-app/node_modules ./next-app/node_modules
COPY --from=builder /app/next-app/package.json ./next-app/package.json

# Shared packages required at runtime
COPY --from=builder /app/packages ./packages

EXPOSE 3000
CMD ["sh", "-c", "cd next-app && npm run start"]
