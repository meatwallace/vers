# chrononomicon

## usage

```sh
# lint, typecheck, unit tests
yarn lint
yarn typecheck
yarn test

# build, dev, test specific project
yarn build:<project>
yarn dev:<project>
yarn test:<project>

# run graphql types codegen
yarn codegen:graphql

# spin up full backend in daemon mode
yarn stack:start

# rebuild full backend
yarn stack:build

# install e2e browsers
yarn playwright install

# run all e2e tests
yarn e2e

# stop full backend
yarn stack:stop
```
