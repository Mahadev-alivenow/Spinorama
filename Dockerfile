# 1️⃣ Builder stage
FROM node:20-alpine AS builder

WORKDIR /app

# Set to production, but we need devDependencies for building
ENV NODE_ENV=development

# First copy files to enable cache
COPY package*.json .

# Install all (so we have vite, vite-tsconfig-paths, etc.)
RUN npm install

# Now copy rest
COPY . .

# Build the application
RUN npm run build


# 2️⃣ Run stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Only copy necessary files
COPY package*.json .

# Install production deps
RUN npm install --omit=dev

# Then copy over the build output
COPY --from=builder /app/build .

# Expose port
EXPOSE 3000

# Run
CMD ["npm", "run", "docker-start"]
