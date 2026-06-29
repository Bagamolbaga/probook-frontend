ARG NODE_VERSION=20
ARG APP_DIRNAME=main
ARG PROJECT=main

# 1. Alpine image
FROM node:${NODE_VERSION}-alpine AS alpine
RUN apk update
RUN apk add --no-cache libc6-compat

# Setup pnpm and turbo on the alpine base
FROM alpine AS base
RUN corepack enable
# Replace <your-major-version> with the major version installed in your repository. For example:
# RUN npm install turbo@2.1.3 --global
RUN npm install turbo --global

RUN pnpm config set store-dir ~/.pnpm-store

# 2. Prune projects
FROM base AS pruner
# https://stackoverflow.com/questions/49681984/how-to-get-version-value-of-package-json-inside-of-dockerfile
# RUN export VERSION=$(npm run version)

# Set working directory
WORKDIR /app

# It might be the path to <ROOT> turborepo
COPY . .
 
# Generate a partial monorepo with a pruned lockfile for a target workspace.
# Assuming "@acme/nextjs" is the name entered in the project's package.json: { name: "@acme/nextjs" }
RUN turbo prune --scope=main --docker
 
# 3. Build the project
FROM base AS builder

# Environment to skip .env validation on build
# ENV CI=true

WORKDIR /app

# Copy lockfile and package.json's of isolated subworkspace
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ .

# First install the dependencies (as they change less often)
RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm install --frozen-lockfile
 
# Copy source code of isolated subworkspace
COPY --from=pruner /app/out/full/ .
COPY --from=pruner /app/apps/main/.env apps/main/.env

RUN pnpm build --filter=main

# 4. Final image - runner stage to run the application
FROM base AS runner
 
# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

WORKDIR /app

COPY --from=builder --chown=nextjs:nodejs /app .
WORKDIR /app/apps/main

ARG PORT=3000
ENV PORT=3000
EXPOSE 3000

CMD ["pnpm", "start"]



















# FROM node:20-alpine AS base
# ENV PNPM_HOME="/pnpm"
# ENV PATH="$PNPM_HOME:$PATH"
# RUN corepack enable
# RUN corepack use pnpm@8.7.6


##########################################################




# FROM node:20-alpine AS pruner

# WORKDIR /app
# RUN npm install -g turbo
# COPY . .
# RUN turbo prune --scope=main --docker

# FROM node:20-alpine AS installer
# ENV PNPM_HOME="/pnpm"
# ENV PATH="$PNPM_HOME:$PATH"
# RUN corepack enable
# RUN corepack use pnpm@8.7.6

# WORKDIR /app
# COPY --from=pruner /app/out/json .
# COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
# COPY --from=pruner /app/turbo.json ./turbo.json
# # RUN npm install -g pnpm
# # RUN pnpm install
# RUN pnpm install --frozen-lockfile

# FROM node:20-alpine AS builder
# ENV PNPM_HOME="/pnpm"
# ENV PATH="$PNPM_HOME:$PATH"
# RUN corepack enable
# RUN corepack use pnpm@8.7.6

# WORKDIR /app
# COPY --from=installer /app/ .
# COPY --from=pruner /app/out/full .
# # RUN npm install -g pnpm
# RUN pnpm run build

# FROM node:20-alpine AS runner
# ENV PNPM_HOME="/pnpm"
# ENV PATH="$PNPM_HOME:$PATH"
# RUN corepack enable
# RUN corepack use pnpm@8.7.6

# WORKDIR /app
# ENV NODE_ENV=production
# # RUN npm install -g pnpm
# COPY --from=builder /app/ .
# WORKDIR /app/apps/main

# CMD ["pnpm", "start"]






##########################################################
# FROM node:22-alpine AS base
# ENV PNPM_HOME="/pnpm"
# ENV PATH="$PNPM_HOME:$PATH"
# RUN corepack enable
# RUN corepack use pnpm@8.7.6

# FROM base AS builder
# RUN apk update && apk add --no-cache libc6-compat
# WORKDIR /app
# # RUN pnpm add turbo --global
# RUN npm i -g turbo

# COPY . .
# RUN turbo prune main --docker

# FROM base AS installer
# WORKDIR /app

# COPY .gitignore .gitignore
# # COPY reset.d.ts reset.d.ts # only if you're using ts-reset library
# COPY --from=builder /app/out/json/ .
# COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
# COPY --from=builder /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
# RUN pnpm install --frozen-lockfile
# # RUN pnpm add turbo --global
# RUN npm i -g turbo


# COPY --from=builder /app/out/full/ .
# COPY turbo.json turbo.json

# RUN turbo run build --filter=main

# FROM base AS runner
# WORKDIR /app

# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs
# USER nextjs

# COPY --from=installer /app/apps/main/ .
# # COPY --from=installer /app/apps/main/package.json .

# # COPY --from=installer --chown=nextjs:nodejs /app/apps/main/.next/standalone ./
# # COPY --from=installer --chown=nextjs:nodejs /app/apps/main/.next/static ./apps/main/.next/static
# # COPY --from=installer --chown=nextjs:nodejs /app/apps/main/public ./apps/main/public

# WORKDIR /app/apps/main

# CMD ["pnpm", 'start']







##########################################################








# # Add lockfile and package.json's of isolated subworkspace
# FROM base AS installer
# RUN apk update && apk add --no-cache libc6-compat
# WORKDIR /app

# # First install the dependencies (as they change less often)
# COPY --from=prune /app/out/json/ .
# # RUN pnpm i --frozen-lockfile
# # RUN pnpm install --frozen-lockfile


# # Build the project
# FROM base AS builder
# WORKDIR /app

# # COPY --from=installer /app/node_modules /app/node_modules
# COPY --from=prune /app/out/json/ .
# COPY --from=prune /app/out/full/ .
# RUN pnpm i --frozen-lockfile
# RUN pnpm turbo build --filter=main


# FROM base AS runner
# WORKDIR /app

# # Don't run production as root
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs
# USER nextjs

# # Automatically leverage output traces to reduce image size
# # https://nextjs.org/docs/advanced-features/output-file-tracing

# # COPY --from=installer --chown=nextjs:nodejs /app/node_modules /app/node_modules
# COPY --from=prune   --chown=nextjs:nodejs /app/out/json/ .
# COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP} /app/apps/${APP}

# WORKDIR /app/apps/${APP}

# CMD ["pnpm", "start"]