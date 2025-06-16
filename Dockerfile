# Use Node 20 Alpine image directly
FROM node:20-alpine

# Expose the application port
EXPOSE 3000

# Set the working directory
WORKDIR /app

# Set the production environment
ENV NODE_ENV=production

# Copy the package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install --omit=dev && npm cache clean --force

# Optional: Remove CLI packages if they are not needed in production
RUN npm remove @shopify/cli

# Copy all app files to the container
COPY . .

# Build the application
RUN npm run build

# Define the default command
CMD ["npm", "run", "docker-start"]
