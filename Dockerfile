# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files and install ALL dependencies
COPY package*.json ./
RUN npm install

# Copy source and Prisma schema
COPY . .

# Generate Prisma Client to the custom path you wanted
RUN npx prisma generate

# Build the NestJS app
RUN npm run build

# Stage 2: Runtime
FROM node:22-alpine AS runner

WORKDIR /app

# Only copy what is needed for execution
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
# Ensure the generated prisma client is available in the runner
COPY --from=builder /app/src/generated ./src/generated

# Set environment to production
ENV NODE_ENV=production

# Your requested port
EXPOSE 5225

CMD ["node", "dist/main"]