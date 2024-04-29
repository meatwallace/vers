# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.12.2
FROM node:${NODE_VERSION}-slim as build

# Node.js app lives here
WORKDIR /not_app

# Set production environment
ENV NODE_ENV="production"

# Copy application code
COPY --link . .

# Build application
RUN \
  # without removing dev/test env files, remix loads the wrong one in our prod bundle.
  # issue does not exist outside of docker - cannot be bothered spending any more time working out why.
  rm -f projects/app-web/.env.development && \
  rm -f projects/app-web/.env.test && \
  # build application
  yarn build:app-web --mode production && \
  # clean up msw
  rm -f projects/app-web/build/client/mockServiceWorker.js && \
  # remove our root package.json so no workspace shenanigans
  rm -f package.json && \
  # install our minimum required dependencies to run our remix server
  cd projects/app-web && \
  npm install --omit=dev

# Final stage for app image
FROM node:${NODE_VERSION}-alpine

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Copy built application
COPY --from=build /not_app/projects/app-web/package.json /not_app/projects/app-web/server.mjs /app/
COPY --from=build /not_app/projects/app-web/node_modules /app/node_modules
COPY --from=build /not_app/projects/app-web/build /app/build

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "npm", "run", "start" ]
