ARG NODE_VERSION=20.18.3

FROM vers/monorepo-base:latest AS build

ENV NODE_ENV="production"

RUN \
  # without removing dev/test env files, vite loads the wrong one in our prod bundle.
  # issue does not exist outside of docker - cannot be bothered spending any more time working out why.
  rm -f projects/app-web/.env.development && \
  rm -f projects/app-web/.env.test && \
  # build application
  yarn build:app-web --mode production && \
  # clean up msw
  rm -f projects/app-web/build/client/mockServiceWorker.js && \
  # remove our root package.json so no workspace shenanigans
  rm -f package.json && \
  # install our minimum required dependencies to run our server
  cd projects/app-web && \
  npm install --omit=dev --legacy-peer-deps

FROM node:${NODE_VERSION}-alpine

LABEL fly_launch_runtime="Node.js"

WORKDIR /app

ENV NODE_ENV="production"

COPY --from=build /app/projects/app-web/package.json /app/projects/app-web/server.mjs /app/
COPY --from=build /app/projects/app-web/node_modules /app/node_modules
COPY --from=build /app/projects/app-web/build /app/build

EXPOSE 3000
CMD [ "npm", "run", "start" ]
