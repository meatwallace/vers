ARG NODE_VERSION=20.18.3

FROM node:${NODE_VERSION}-slim AS base

WORKDIR /app

COPY --link . .