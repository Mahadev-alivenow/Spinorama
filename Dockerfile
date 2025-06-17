# 1️⃣ Builder
FROM node:20-alpine AS builder

WORKDIR /app

ENV NODE_ENV=development

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

# 2️⃣ Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Install curl for health checks
RUN apk add --no-cache curl

COPY package*.json ./
RUN npm install --omit=dev

COPY prisma ./prisma
RUN npx prisma generate

COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public

# Create a startup script
COPY <<EOF /app/start.sh
#!/bin/sh
echo "Starting server..."
echo "NODE_ENV: \$NODE_ENV"
echo "HOST: \$HOST"
echo "PORT: \$PORT"
echo "SHOPIFY_APP_URL: \$SHOPIFY_APP_URL"

# Start the server
exec node ./build/server/index.js
EOF

RUN chmod +x /app/start.sh

EXPOSE 3000

# Updated health check with more retries and longer intervals
HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Use the startup script
CMD ["/app/start.sh"]
