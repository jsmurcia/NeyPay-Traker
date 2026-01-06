# Frontend (Next.js) production Dockerfile
FROM node:20-alpine AS base

RUN npm i -g pnpm
WORKDIR /app

# Install deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .
 
 # Inject public env at build time for client bundle
 ARG NEXT_PUBLIC_WS_URL
 ENV NEXT_PUBLIC_WS_URL=${NEXT_PUBLIC_WS_URL}
 
 RUN pnpm build

# Run stage
FROM node:20-alpine AS production
RUN npm i -g pnpm
WORKDIR /app

ENV NODE_ENV=production

COPY --from=base /app .

EXPOSE 3000
CMD ["pnpm", "start"]
