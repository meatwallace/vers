ARG NODE_VERSION=20.18.3

FROM vers/monorepo-base:latest AS build

WORKDIR /app

ENV NODE_ENV="production"

# used for vite build mode
ARG BUILD_MODE=production
ENV BUILD_MODE $BUILD_MODE

RUN \
  yarn run build:db-postgres --mode "$BUILD_MODE" && \
  cd projects/db-postgres/dist && \
  # disable pnp so we can simply resolve our modules 
  yarn config set nodeLinker node-modules && \
  yarn install

FROM node:${NODE_VERSION}-alpine

LABEL fly_launch_runtime="Node.js"

WORKDIR /app

ENV NODE_ENV="production"

COPY --from=build /app/projects/db-postgres/dist /app
COPY --from=build /app/projects/db-postgres/migrations /app/migrations

CMD [ "migrate.js" ]
