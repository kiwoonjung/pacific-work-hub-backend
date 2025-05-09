exports.up = function (knex) {
  return knex.schema.hasTable("users").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("users", (table) => {
        table.increments("id").primary();
        table.string("azure_id", 255).notNullable().unique();
        table.string("email", 255);
        table.string("first_name", 255).notNullable();
        table.string("last_name", 255).notNullable();
        table.string("photo_url", 255);
        table.string("job_title", 255);
        table.string("department", 255);
        table.string("role", 255);
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
