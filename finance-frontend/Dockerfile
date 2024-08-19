FROM node:18-alpine as base
RUN apk add --no-cache g++ make py3-pip libc6-compat bash
WORKDIR /app

COPY package*.json ./

RUN npm install

EXPOSE 3000

FROM base as builder
WORKDIR /app
COPY . .

ARG NEXT_PUBLIC_API_URL=DUMMY_NEXT_PUBLIC_API_URL

RUN chmod +x /app/entrypoint.sh
RUN chmod +x /app/replace-variables.sh

RUN npm run build

FROM base as production
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/entrypoint.sh ./entrypoint.sh
COPY --from=builder /app/replace-variables.sh ./replace-variables.sh

ENTRYPOINT ["bash", "/app/entrypoint.sh"]