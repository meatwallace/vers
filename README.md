# chrononomicon

## usage

```sh
# start postgres container for tests
yarn test:start-pg

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

# generate and run our postgres migrations
yarn postgres:migrations-generate
yarn postgres:migrations-run:dev

# update our postgres migrations after updating drizzle
yarn postgres:migrations-update

# install e2e browsers
yarn playwright install

# run all e2e tests
yarn e2e

# stop full backend
yarn stack:stop

# stop specific service
yarn stack:stop:<service>
```

## generating PKSC8 private key for JWT signing

```sh
openssl genpkey -out rsakey.pem -algorithm RSA -pkeyopt rsa_keygen_bits:2048
```

## development with cursor

all of our cursor rules & agentic process is stored in the [.cursor](.cursor) directory.

consider prompting an agentic composer like:

> We are working on a new feature for the <project-name> project.
> At a high level, we want to <describe-feature>.
>
> Please review the @001-initialization.md file to get proceed.
