# Use Node 18+ or whatever your project prefers
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies first (without dev deps if you want to reduce size afterwards)
COPY package*.json .
RUN npm ci

# Build the application
COPY . .
RUN npm run build

# Now create a lightweight production image
FROM node:18-alpine AS runner

WORKDIR /app

# Only copy the files we need
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json .

# Install production dependencies
RUN npm ci --production

# Run
CMD ["npm", "start"]
