# vers

## usage

```sh
# start postgres container for tests
yarn pg:test-container:start

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
yarn pg:migrations-generate
yarn pg:migrations-run:dev

# update our postgres migrations after updating drizzle
yarn pg:migrations-update

# install e2e browsers
yarn playwright install

# run all e2e tests
yarn e2e

# stop full backend
yarn stack:stop

# stop specific service
yarn stack:stop:<service>
```

## generating keys for JWT signing & verification

```sh

# generate rs256 private key
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 | openssl pkcs8 -topk8 -nocrypt > privkey.pem

# extract pubkey
openssl pkey -pubout -in privkey.pem -out pubkey.crt
```

## creating a new fly deployment

```sh
cd projects/<project-name>

# initial deployment
fly launch

# attach our service to our postgres instance
fly pg attach vers-pg --database-name=vers
```

## development with cursor

all of our cursor rules & agentic process is stored in the [.cursor](.cursor) directory.

consider prompting an agentic composer like:

> We are working on a new feature for the \<project-name> project.  
> At a high level, we want to \<describe-feature>.
>
> Read @001-initialization.md and related files and confirm you're ready to proceed.
