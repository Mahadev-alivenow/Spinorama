# 1️⃣ Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Set to development to enable devDependencies
ENV NODE_ENV=development

# Install all (including devDependencies)
COPY package*.json .
RUN npm install

# Now copy rest of the application
COPY . .

# Build
RUN npm run build


# 2️⃣ Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install production dependencies
COPY package*.json .

RUN npm install --omit=dev

# Then copy over the build output
COPY --from=builder /app/build .

# Expose port
EXPOSE 3000

# Run application
CMD ["npm", "start"]