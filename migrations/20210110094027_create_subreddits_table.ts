import * as Knex from "knex";
import { CreateTableBuilder } from "knex";

export async function up(db: Knex): Promise<void> {
  await db.schema.createTable("subreddits", (table: CreateTableBuilder) => {
    table.increments("id").notNullable().primary();
    table
      .specificType("created_at", "timestamptz")
      .notNullable()
      .defaultTo(db.fn.now());
    table
      .specificType("updated_at", "timestamptz")
      .notNullable()
      .defaultTo(db.fn.now());
    table.specificType("deleted_at", "timestamptz");
    table.string("name", 100).unique().notNullable().defaultTo("");
    table.string("url", 200).unique().notNullable().defaultTo("");
    table.jsonb("top").notNullable().defaultTo("{}");
  });
}

export async function down(db: Knex): Promise<void> {
  await db.schema.dropSchemaIfExists("subreddits");
}
