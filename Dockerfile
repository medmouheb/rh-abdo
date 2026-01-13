# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Set environment variables for build
ENV DATABASE_URL="file:./prisma/dev.db"
ENV PRISMA_CLIENT_ENGINE_TYPE=library
ENV NEXT_TELEMETRY_DISABLED=1
ENV JWT_SECRET=temporary_secret_for_build_purposes
ENV SKIP_BUILD_STATIC_GENERATION=true
ENV IS_BUILD=true

# Create .env file for build static analysis
RUN echo "DATABASE_URL=file:./prisma/dev.db" > .env
RUN echo "PRISMA_CLIENT_ENGINE_TYPE=library" >> .env
RUN echo "JWT_SECRET=temporary_secret_for_build_purposes" >> .env

# Generate Prisma client and build Next.js app
RUN npx prisma generate
RUN PRISMA_CLIENT_ENGINE_TYPE=library npm run build

# Production stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV DATABASE_URL="file:./prisma/dev.db"
ENV PRISMA_CLIENT_ENGINE_TYPE=library

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/src ./src

EXPOSE 3000

# Script to run migrations and start the app
CMD sh -c "npx prisma migrate deploy && npx prisma db seed && npm start"
