module.exports = {
  development: {
    client: "postgresql",
    connection: {
      database: "reddit-newsletter",
      user: "postgres",
      password: "postgres",
      servername: "10.254.254.254",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
  staging: {},
  production: {},
};
