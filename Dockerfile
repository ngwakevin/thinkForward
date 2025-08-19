# Multi-stage production build for Next.js 14 app (standalone output)
FROM node:20-alpine AS deps
WORKDIR /app
# Install system deps if needed (e.g., sharp). Not required here by default.
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
# Use npm ci if lockfile present
RUN if [ -f package-lock.json ]; then npm ci; \
    elif [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install --frozen-lockfile; \
    else npm install; fi

FROM node:20-alpine AS builder
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build (Next will create .next/standalone for minimal runtime when output:standalone is set automatically in recent versions)
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    NEXT_TELEMETRY_DISABLED=1
# Create non-root user
RUN addgroup -g 1001 -S nodegrp && adduser -S nodeuser -G nodegrp
# Copy only the standalone server + static assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# (Optional) copy next.config.mjs if used at runtime for images / rewrites
COPY --from=builder /app/next.config.mjs ./
USER nodeuser
EXPOSE 3000
# Start the Next.js standalone server
CMD ["node", "server.js"]
