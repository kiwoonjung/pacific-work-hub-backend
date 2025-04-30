exports.up = function (knex) {
  return knex.schema
    .hasTable("pfp_produce_items")
    .then((exists) => {
      if (!exists) {
        return knex.schema.createTable("pfp_produce_items", (table) => {
          table.increments("id").primary();
          table.string("item_no", 20).notNullable().unique();
          table.text("common_name");
          table.text("origin");
          table.text("size");
          table.text("weight");
          table.integer("weight_unit");
          table.text("scientific_name");
          table.text("package_type");
        });
      }
    })
    .then(() =>
      knex.schema.hasTable("pfp_lots").then((exists) => {
        if (!exists) {
          return knex.schema.createTable("pfp_lots", (table) => {
            table.increments("id").primary();
            table.string("lot_number", 50).notNullable().unique();
            table
              .integer("item_id")
              .references("id")
              .inTable("pfp_produce_items")
              .onDelete("SET NULL");
            table.date("date_received");
            table.text("po_number");
            table.text("note");
          });
        }
      })
    )
    .then(() =>
      knex.schema.hasTable("pfp_received_items").then((exists) => {
        if (!exists) {
          return knex.schema.createTable("pfp_received_items", (table) => {
            table.increments("id").primary();
            table
              .integer("lot_id")
              .references("id")
              .inTable("pfp_lots")
              .onDelete("SET NULL");
            table.text("format_size");
            table.integer("qty_received");
          });
        }
      })
    )
    .then(() =>
      knex.schema.hasTable("pfp_cash_customers").then((exists) => {
        if (!exists) {
          return knex.schema.createTable("pfp_cash_customers", (table) => {
            table.increments("id").primary();
            table.text("name");
            table.text("customer_number");
            table.text("phone");
            table.text("note");
          });
        }
      })
    )
    .then(() =>
      knex.schema.hasTable("pfp_clients").then((exists) => {
        if (!exists) {
          return knex.schema.createTable("pfp_clients", (table) => {
            table.increments("id").primary();
            table.text("company_name");
            table.text("contact_name");
            table.text("street_address");
            table.text("city");
            table.text("province");
            table.text("postal_code");
            table.text("company_phone");
            table.text("direct_phone");
            table.text("fax");
            table.text("email");
          });
        }
      })
    )
    .then(() =>
      knex.schema.hasTable("pfp_shipped_items").then((exists) => {
        if (!exists) {
          return knex.schema.createTable("pfp_shipped_items", (table) => {
            table.increments("id").primary();
            table
              .integer("lot_id")
              .references("id")
              .inTable("pfp_lots")
              .onDelete("SET NULL");
            table
              .integer("item_id")
              .references("id")
              .inTable("pfp_produce_items")
              .onDelete("SET NULL");
            table.text("format_size");
            table.integer("qty_shipped");
            table.date("date_shipped");
            table.text("customer_invoice");
            table
              .integer("cash_customer_id")
              .references("id")
              .inTable("pfp_cash_customers")
              .onDelete("SET NULL");
            table
              .integer("client_id")
              .references("id")
              .inTable("pfp_clients")
              .onDelete("SET NULL");
            table.text("pfp_po_number");
            table.text("vehicle_inspection_ok");
            table.text("vehicle_covered_ok");
            table.text("truck_trailer_id");
          });
        }
      })
    );
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("pfp_shipped_items")
    .dropTableIfExists("pfp_clients")
    .dropTableIfExists("pfp_cash_customers")
    .dropTableIfExists("pfp_received_items")
    .dropTableIfExists("pfp_lots")
    .dropTableIfExists("pfp_produce_items");
};
