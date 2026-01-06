# Use the official Node.js 18 Alpine image as the base
FROM node:18-alpine AS base

# Install pnpm globally
RUN npm install -g pnpm

# Set the working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy TypeScript config and source
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src/ src/
COPY test/ test/

# Build the application
RUN pnpm build

# Production stage
FROM node:18-alpine AS production

# Install pnpm globally (needed for running scripts if any)
RUN npm install -g pnpm

# Set the working directory
WORKDIR /app

# Copy built application from base stage
COPY --from=base /app/dist ./dist

# Copy node_modules from base stage
COPY --from=base /app/node_modules ./node_modules

# Copy package.json for any runtime scripts
COPY package.json ./

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"]