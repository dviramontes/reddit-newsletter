# `reddit-newsletter`

> daily personalized reddit newsletters in your inbox

### Project Layout

```
{root}

src
├── controllers            # defines methods for interacting with our database
│   ├── newsletter.ts
│   └── subreddit.ts
├── db.ts                  # database connection handler
├── handlers.ts
├── index.ts               # main entrypoint - runs as server, publish and update worker modes
├── reddit.ts              # reddit restful utilities
├── routes.ts              # defines the structure of our API
├── server.ts              # Express.js server + middleware
├── types.ts
└── workers                # defines lambda like functions for executing various tasks
    ├── publish.ts
    └── update.ts

...
```

- [For API service endpoints refer to this doc](./API.md)
- [For infra details and usage check out this doc](./k8s/README.md)

### Requirements

- [Node >= 12](https://nodejs.org/en/download/)
- [Docker](https://docs.docker.com/get-docker/)
- [NVM](https://github.com/nvm-sh/nvm)

### Setup

- npm i

#### create alias for docker mac

- `sudo ifconfig lo0 alias 10.254.254.254`

#### or linux

- `sudo apt-get install net-tools -y`
- `sudo ifconfig lo:0 10.254.254.254.254`

### Development

- `make dcu`
- `make start`

other dev tasks

#### Linting

- `npm run format` uses prettier

#### Database Change Management

Create new migration

- `npx knex migrate:make <migration_name> -x ts`

Running migrations

- `npx knex migrate:latest --env <env>` where _env_ can be development, staging or production
- `npx knex migrate:rollback` rollback latest
- `npx knex migrate:list` list pending migrations
- For more commands available from knex checkout [this page](https://knexjs.org/#Migrations)

#### Workers

Workers are lambda like functions that execute a given task and exit.
They are designed to interact with our API service and can be deployed and scaled independently of user requests.

- **update-worker**: updates subreddit's top column with the latest top 3 posts
- **publish-worker**: publishes a newsletter (right now all it does is print to STDOUT but it will be useful soon :)

##### Running workers locally with docker

- `make dcu` # starts docker-compose with postgres DB
- `make start` # starts API server
- `make build workers` # builds worker code + image
- `docker run -it --network host reddit-newsletter/update-worker` # runs worker once and exists

##### Running workers locally with kubernetes (I use minikube but you are welcomed to use something more lightweight)

- Please refer to [this doc](./k8s/README.md) for usage

### TODO (things i would like to build next)

- [ ] Abstract more db interaction code intro controllers so we can reuse queries and business logic
- [ ] Write test
- [ ] CICD
- [ ] Build out the operator pattern to kick off more request to kubernetes job workers on demand from API server
- [ ] Add infra for API service

### Production

- `make build worker` # builds worker images
- `make build service` # builds service image aka API server
