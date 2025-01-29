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

# Copy application code
COPY --link . .

# Build application & install specific dependencies
RUN \
  yarn run build:service-email --mode "$BUILD_MODE" && \
  cd projects/service-email/dist && \
  # disable pnp so we can simply resolve our modules 
  yarn config set nodeLinker node-modules && \
  yarn install

# Final stage for app image
FROM gcr.io/distroless/nodejs${NODE_VERSION}

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Copy built application
COPY --from=build /app/projects/service-email/dist /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3001
CMD [ "main.js" ]
