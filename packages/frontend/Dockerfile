FROM node:22.12-slim AS base

# Install dependencies
FROM base AS deps
WORKDIR /app/packages/frontend

COPY packages/frontend/package.json ./
RUN npm install

# Build
FROM base AS builder
WORKDIR /app/packages/frontend

COPY --from=deps /app/packages/frontend/node_modules ./node_modules
COPY packages/frontend ./

RUN npm run build

# Production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/packages/frontend/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/packages/frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/packages/frontend/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
