FROM node:18-slim AS base
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
    g++ \
    make \
    python3 \
    bash \
    file \
    dos2unix && \
    rm -rf /var/lib/apt/lists/*
COPY package*.json ./
EXPOSE 3010

FROM base AS builder
WORKDIR /app
COPY . .

RUN dos2unix entrypoint.sh
RUN dos2unix replace-variables.sh
RUN npm install

ARG NEXT_PUBLIC_API_URL=DUMMY_NEXT_PUBLIC_API_URL
ENV NODE_ENV=production

RUN npm run build --verbose

FROM base AS production
WORKDIR /app
COPY --from=builder /app .

RUN chmod +x /app/entrypoint.sh
RUN chmod +x /app/replace-variables.sh

ENTRYPOINT ["bash", "/app/entrypoint.sh"]