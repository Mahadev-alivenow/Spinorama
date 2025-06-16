# 1️⃣ Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Set to development to enable devDependencies
ENV NODE_ENV=development

# Install all dependencies (including devDependencies)
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# 2️⃣ Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy the build output from builder stage
# This maintains the build directory structure
COPY --from=builder /app/build ./build

# Copy any other necessary files (like public assets if needed)
COPY --from=builder /app/public ./public

# Expose port
EXPOSE 3000

# Run application
CMD ["npm", "start"]