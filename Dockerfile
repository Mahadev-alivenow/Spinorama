# 1️⃣ Builder
FROM node:20-alpine AS builder

WORKDIR /app

ENV NODE_ENV=development

# Install all dependencies (including devDependencies)
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# 2️⃣ Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install curl for health checks
RUN apk add --no-cache curl

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy Prisma schema and generate client in production
COPY prisma ./prisma
RUN npx prisma generate

# Copy the build output from builder stage
COPY --from=builder /app/build ./build

# Copy any other necessary files (like public assets if needed)
COPY --from=builder /app/public ./public

# Create a startup script that ensures proper host binding
RUN cat > start.sh << 'EOF'
#!/bin/sh
set -e

echo "🚀 Starting Remix application..."
echo "📍 Working directory: $(pwd)"
echo "🔧 Node version: $(node --version)"
echo "🌐 Port: ${PORT:-3000}"

# Verify build exists
if [ ! -f "./build/server/index.js" ]; then
    echo "❌ Server build not found!"
    ls -la ./build/
    exit 1
fi

# Set environment variables to ensure proper binding
export HOST=0.0.0.0
export PORT=${PORT:-3000}

echo "✅ Starting server on $HOST:$PORT"

# Start the server
exec node ./build/server/index.js
EOF

RUN chmod +x start.sh

# Expose port
EXPOSE 3000

# Health check with longer startup time
HEALTHCHECK --interval=15s --timeout=10s --start-period=60s --retries=5 \
    CMD curl -f http://localhost:3000/health || exit 1

# Run the startup script
CMD ["./start.sh"]