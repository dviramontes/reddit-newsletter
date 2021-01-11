# `reddit-newsletter`

> daily personalized reddit newsletters in your inbox

### Project Layout

```
{root}

// TODO
```

### Requirements

- Node >= 12
- Docker
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
- `npm run dev`
- `npm run worker`

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

### TODO

- [ ] Abstract more db interactions code intro controllers so we can reuse queries and business logic
- [ ] Write test
- [ ] CICD

### Production

- `make build worker` # builds worker image
- `make build service` # builds service image aka API server
