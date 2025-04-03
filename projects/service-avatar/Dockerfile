# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-slim AS build

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# use a build arg to specify our vite build mode
ARG BUILD_MODE=production
ENV BUILD_MODE $BUILD_MODE

# Use a build arg to specify our sentry auth token
ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN $SENTRY_AUTH_TOKEN

# Set up certificates so sentry can make a deployment
RUN apt-get update && apt-get install -y ca-certificates  

# Copy application code
COPY --link . .

# Build application & install specific dependencies
RUN \
  yarn run build:service-avatar --mode "$BUILD_MODE" && \
  cd projects/service-avatar/dist && \
  # disable pnp so we can simply resolve our modules 
  yarn config set nodeLinker node-modules && \
  yarn install

# Final stage for app image
FROM node:${NODE_VERSION}-alpine

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Copy built application
COPY --from=build /app/projects/service-avatar/dist /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3005
CMD [ "main.js" ]
