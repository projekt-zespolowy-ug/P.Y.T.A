FROM oven/bun:1.2.3 AS base
FROM base AS builder
ARG NEXT_PUBLIC_API_URL

WORKDIR /app

COPY package.json  bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build
CMD [ "bun", "run", "start" ]
# CMD [ "bun","run next" ]