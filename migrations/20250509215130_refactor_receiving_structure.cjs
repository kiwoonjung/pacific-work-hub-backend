exports.up = function (knex) {
  return knex.schema
    .createTable("pfp_receivings", (table) => {
      table.increments("id").primary();
      table.date("date_received");
      table.text("po_number");
      table.text("note");
    })
    .then(() => {
      return knex.schema.table("pfp_received_items", (table) => {
        table
          .integer("receiving_id")
          .references("id")
          .inTable("pfp_receivings")
          .onDelete("SET NULL");
      });
    });
};

exports.down = function (knex) {
  return knex.schema
    .table("pfp_received_items", (table) => {
      table.dropColumn("receiving_id");
    })
    .then(() => {
      return knex.schema.dropTableIfExists("pfp_receivings");
    });
};
