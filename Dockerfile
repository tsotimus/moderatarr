# Stage 1: Build and migrate
FROM oven/bun:1.2.19-slim AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install all dependencies (including dev dependencies for drizzle-kit)
RUN bun install --frozen-lockfile

# Copy source code and config files
COPY . .

# Create data directory for SQLite database
RUN mkdir -p /app/data

# Run database migrations
RUN bun drizzle-kit migrate

# Stage 2: Production
FROM oven/bun:1.2.19-slim

# Set working directory
WORKDIR /app

# Install system dependencies for health checks
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json bun.lock* ./

# Install only production dependencies
RUN bun install --frozen-lockfile --production

# Copy source code from builder stage
COPY --from=builder /app/src ./src
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/emails ./emails

# Copy the database with migrations applied
COPY --from=builder /app/data ./data
COPY --from=builder /app/moderatarr.db ./moderatarr.db

# Use non-root user for security
RUN addgroup --gid 1001 --system nodejs && \
    adduser --system --uid 1001 nodejs && \
    chown -R nodejs:nodejs /app

USER nodejs

# Set production environment
ENV NODE_ENV=production

# Expose port (use PORT env var, default to 3000)
EXPOSE ${PORT:-3000}

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT:-3000}/health || exit 1

# Start the application
CMD ["bun", "start"] 