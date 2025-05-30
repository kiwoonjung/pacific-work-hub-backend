exports.up = function (knex) {
  return (
    // Produce Items
    knex.schema
      .createTable("pfp_produce_items", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.string("item_no", 32).notNullable().unique();
        table.string("common_name");
        table.string("origin");
        table.string("size");
        table.string("weight");
        table.string("weight_unit");
        table.string("scientific_name");
        table.string("package_type");
        table.enu("status", ["active", "inactive"]).defaultTo("active");
        table.timestamps(true, true);
      })
      // Suppliers
      .then(() =>
        knex.schema.createTable("pfp_suppliers", (table) => {
          table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
          table.string("name").notNullable();
          table.string("contact_name");
          table.string("email");
          table.string("phone");
          table.string("address");
          table.timestamps(true, true);
        })
      )
      // Purchase Orders
      .then(() =>
        knex.schema.createTable("pfp_purchase_orders", (table) => {
          table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
          table.string("po_number", 50).notNullable().unique();
          table.date("date_created").notNullable();
          table.date("eta_date").nullable();
          table
            .uuid("supplier_id")
            .references("id")
            .inTable("pfp_suppliers")
            .onDelete("SET NULL");
          table
            .enu("status", [
              "draft",
              "submitted",
              "confirmed",
              "open",
              "partial",
              "complete",
            ])
            .defaultTo("draft");
          table.text("note");
          table.timestamps(true, true);
        })
      )
      // Purchase Order Items
      .then(() =>
        knex.schema.createTable("pfp_purchase_order_items", (table) => {
          table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
          table
            .uuid("purchase_order_id")
            .references("id")
            .inTable("pfp_purchase_orders")
            .onDelete("CASCADE");
          table
            .uuid("produce_item_id")
            .references("id")
            .inTable("pfp_produce_items")
            .onDelete("SET NULL");
          table.integer("quantity_ordered");
          table.integer("quantity_received").defaultTo(0);
          table
            .enu("status", ["pending", "partial", "complete"])
            .defaultTo("pending");
          table.timestamps(true, true);
        })
      )
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
    .dropTableIfExists("pfp_purchase_order_items")
    .dropTableIfExists("pfp_purchase_orders")
    .dropTableIfExists("pfp_suppliers")
    .dropTableIfExists("pfp_produce_items");
};
