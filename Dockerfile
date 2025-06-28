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
ENV HOST=https://seal-app-2smk6.ondigitalocean.app/
ENV PORT=3000

# Install curl for health checks
RUN apk add --no-cache curl

COPY package*.json ./
RUN npm install --omit=dev

COPY prisma ./prisma
RUN npx prisma generate

COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public

EXPOSE 3000

# Start the server directly
CMD ["npm", "run", "docker-start"]
