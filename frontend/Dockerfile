FROM oven/bun:latest AS base
FROM base AS builder

WORKDIR /app

COPY package.json  bun.lockb ./
RUN bun install

COPY . .
RUN bun run build
CMD [ "bun", "run", "start" ]
# CMD [ "bun","run next" ]