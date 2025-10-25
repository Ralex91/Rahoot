FROM node:22-alpine AS base

# Enable and prepare pnpm via Corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# ----- DEPENDENCIES -----
FROM base AS deps
WORKDIR /app

# Copy pnpm configuration files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/web/package.json ./packages/web/
COPY packages/socket/package.json ./packages/socket/

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# ----- BUILDER -----
FROM base AS builder
WORKDIR /app

# Copy all monorepo files
COPY . .

# Install all dependencies (including dev) for build
RUN pnpm install --frozen-lockfile

# Build Next.js app with standalone output for smaller runtime image
WORKDIR /app/packages/web

ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm build

# Build socket server if needed (TypeScript or similar)
WORKDIR /app/packages/socket
RUN if [ -f "tsconfig.json" ]; then pnpm build; fi

# ----- RUNNER -----
FROM node:22-alpine AS runner
WORKDIR /app

# Create a non-root user for better security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs


# Enable pnpm in the runtime image
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy configuration files
COPY pnpm-workspace.yaml package.json ./

# Copy the Next.js standalone build
COPY --from=builder /app/packages/web/.next/standalone ./
COPY --from=builder /app/packages/web/.next/static ./packages/web/.next/static
COPY --from=builder /app/packages/web/public ./packages/web/public

# Copy the socket server build
COPY --from=builder /app/packages/socket/dist ./packages/socket/dist

# Copy the game default config
COPY --from=builder /app/config ./config

# Expose the web and socket ports
EXPOSE 3000 5505

# Environment variables
ENV NODE_ENV=production
ENV CONFIG_PATH=/app/config

# Start both services (Next.js web app + Socket server)
CMD ["sh", "-c", "node packages/web/server.js & node packages/socket/dist/index.cjs"]
