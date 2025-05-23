exports.up = function (knex) {
  return (
    knex.schema
      // Table: pfp_produce_items
      .hasTable("pfp_produce_items")
      .then((exists) => {
        if (!exists) {
          return knex.schema.createTable("pfp_produce_items", (table) => {
            table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
            table.string("item_no", 20).notNullable().unique();
            table.text("common_name");
            table.text("origin");
            table.text("size");
            table.text("weight");
            table.text("weight_unit");
            table.text("scientific_name");
            table.text("package_type");
            table.timestamps(true, true);
          });
        }
      })

      // Table: pfp_lots
      .then(() => {
        return knex.schema.hasTable("pfp_lots").then((exists) => {
          if (!exists) {
            return knex.schema.createTable("pfp_lots", (table) => {
              table
                .uuid("id")
                .primary()
                .defaultTo(knex.raw("gen_random_uuid()"));
              table.string("lot_number", 50).notNullable().unique();
              table
                .uuid("item_id")
                .references("id")
                .inTable("pfp_produce_items")
                .onDelete("SET NULL");
              table.date("date_received");
              table.text("po_number");
              table.text("note");
              table.timestamps(true, true);
            });
          }
        });
      })

      // Table: pfp_cash_customers
      .then(() => {
        return knex.schema.hasTable("pfp_cash_customers").then((exists) => {
          if (!exists) {
            return knex.schema.createTable("pfp_cash_customers", (table) => {
              table
                .uuid("id")
                .primary()
                .defaultTo(knex.raw("gen_random_uuid()"));
              table.text("name");
              table.text("customer_number");
              table.text("phone");
              table.text("note");
              table.timestamps(true, true);
            });
          }
        });
      })

      // Table: pfp_clients
      .then(() => {
        return knex.schema.hasTable("pfp_clients").then((exists) => {
          if (!exists) {
            return knex.schema.createTable("pfp_clients", (table) => {
              table
                .uuid("id")
                .primary()
                .defaultTo(knex.raw("gen_random_uuid()"));
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
              table.timestamps(true, true);
            });
          }
        });
      })

      // Table: pfp_receivings
      .then(() => {
        return knex.schema.hasTable("pfp_receivings").then((exists) => {
          if (!exists) {
            return knex.schema.createTable("pfp_receivings", (table) => {
              table
                .uuid("id")
                .primary()
                .defaultTo(knex.raw("gen_random_uuid()"));
              table.date("date_received");
              table.text("po_number");
              table.text("note");
              table.timestamps(true, true);
            });
          }
        });
      })

      // Table: pfp_received_items
      .then(() => {
        return knex.schema.hasTable("pfp_received_items").then((exists) => {
          if (!exists) {
            return knex.schema.createTable("pfp_received_items", (table) => {
              table
                .uuid("id")
                .primary()
                .defaultTo(knex.raw("gen_random_uuid()"));
              table
                .uuid("lot_id")
                .references("id")
                .inTable("pfp_lots")
                .onDelete("SET NULL");
              table.text("format_size");
              table.integer("qty_received");
              table
                .uuid("receiving_id")
                .references("id")
                .inTable("pfp_receivings")
                .onDelete("SET NULL");
              table.timestamps(true, true);
            });
          }
        });
      })

      // Table: pfp_shipped_items
      .then(() => {
        return knex.schema.hasTable("pfp_shipped_items").then((exists) => {
          if (!exists) {
            return knex.schema.createTable("pfp_shipped_items", (table) => {
              table
                .uuid("id")
                .primary()
                .defaultTo(knex.raw("gen_random_uuid()"));
              table
                .uuid("lot_id")
                .references("id")
                .inTable("pfp_lots")
                .onDelete("SET NULL");
              table
                .uuid("item_id")
                .references("id")
                .inTable("pfp_produce_items")
                .onDelete("SET NULL");
              table.text("format_size");
              table.integer("qty_shipped");
              table.date("date_shipped");
              table.text("customer_invoice");
              table
                .uuid("cash_customer_id")
                .references("id")
                .inTable("pfp_cash_customers")
                .onDelete("SET NULL");
              table
                .uuid("client_id")
                .references("id")
                .inTable("pfp_clients")
                .onDelete("SET NULL");
              table.text("pfp_po_number");
              table.text("vehicle_inspection_ok");
              table.text("vehicle_covered_ok");
              table.text("truck_trailer_id");
              table.timestamps(true, true);
            });
          }
        });
      })

      // Table: users
      .then(() => {
        return knex.schema.hasTable("users").then((exists) => {
          if (!exists) {
            return knex.schema.createTable("users", (table) => {
              table
                .uuid("id")
                .primary()
                .defaultTo(knex.raw("gen_random_uuid()"));
              table.text("azure_id").notNullable().unique();
              table.text("email");
              table.text("first_name").notNullable();
              table.text("last_name").notNullable();
              table.text("photo_url");
              table.text("job_title");
              table.text("department");
              table.text("role");
              table.timestamps(true, true);
            });
          }
        });
      })
  );
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("users")
    .dropTableIfExists("pfp_shipped_items")
    .dropTableIfExists("pfp_clients")
    .dropTableIfExists("pfp_cash_customers")
    .dropTableIfExists("pfp_received_items")
    .dropTableIfExists("pfp_receivings")
    .dropTableIfExists("pfp_lots")
    .dropTableIfExists("pfp_produce_items");
};
