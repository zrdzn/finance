FROM node:18-slim AS base

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    g++ \
    make \
    python3 \
    bash && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install

FROM base AS builder

WORKDIR /app

COPY . .

ARG NEXT_PUBLIC_API_URL=DUMMY_NEXT_PUBLIC_API_URL

RUN chmod +x /app/entrypoint.sh
RUN chmod +x /app/replace-variables.sh

ENV NODE_OPTIONS="--max_old_space_size=4096"

RUN npm run build --verbose

FROM base AS production
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --gid 1001 nodejs
RUN adduser --uid 1001 --ingroup nodejs --disabled-password --gecos "" nextjs

USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/entrypoint.sh ./entrypoint.sh
COPY --from=builder --chown=nextjs:nodejs /app/replace-variables.sh ./replace-variables.sh

EXPOSE 3010

ENTRYPOINT ["bash", "/app/entrypoint.sh"]