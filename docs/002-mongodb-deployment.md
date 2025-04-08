# MongoDB Fly.io Deployment

## Adding a replica

```sh
fly machine clone <PRIMARY_MACHINE_ID> --region syd --app vers-mongo
fly ssh console --machine <PRIMARY_MACHINE_ID> --app vers-mongo --command "setup-machine <NEW_MACHINE_ID>"
```

## Removing a replica

```sh
fly machine stop <MACHINE_ID_TO_REMOVE>
fly machine destroy <MACHINE_ID_TO_REMOVE>
fly ssh console --machine <PRIMARY_MACHINE_ID> --app vers-mongo --command "remove-machine <MACHINE_ID_TO_REMOVE"
```
