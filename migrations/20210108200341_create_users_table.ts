import * as Knex from "knex";
import { CreateTableBuilder } from "knex";

export async function up(db: Knex): Promise<void> {
  await db.schema.createTable("users", (table: CreateTableBuilder) => {
    table.increments("id").notNullable().primary();
    table
      .specificType("created_at", "timestamptz")
      .notNullable()
      .defaultTo(db.fn.now());
    table
      .specificType("updated_at", "timestamptz")
      .notNullable()
      .defaultTo(db.fn.now());
    table
      .specificType("deleted_at", "timestamptz")
      .notNullable()
      .defaultTo(db.fn.now());
    table.string("full_name", 100).notNullable().unique();
    table.string("email", 50).notNullable().unique();
    table.boolean("active").defaultTo(true);
    table.integer("time_preference").defaultTo(8);
  });
}

export async function down(db: Knex): Promise<void> {
  await db.schema.dropSchemaIfExists("users");
}
