# Use Bun's official image as base
FROM oven/bun:1.2.19-slim

# Set working directory
WORKDIR /app

# Install system dependencies for health checks
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile --production

# Copy source code
COPY . .

# Create data directory for SQLite database
RUN mkdir -p /app/data

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

# Start the application (run migrations first, then start)
CMD ["sh", "-c", "bunx drizzle-kit migrate && bun start"] 