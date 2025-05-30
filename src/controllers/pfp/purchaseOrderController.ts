import { Request, Response } from "express";
import db from "../../config/knex";

// Create a new Purchase Order
export const createPurchaseOrder = async (req: Request, res: Response) => {
  const trx = await db.transaction();
  try {
    const {
      po_number,
      date_created,
      eta_date,
      supplier_id,
      status,
      note,
      items,
    } = req.body;
    // Insert PO
    const [purchaseOrder] = await trx("pfp_purchase_orders")
      .insert({ po_number, date_created, eta_date, supplier_id, status, note })
      .returning("*");
    // Insert PO items
    if (Array.isArray(items)) {
      for (const item of items) {
        await trx("pfp_purchase_order_items").insert({
          purchase_order_id: purchaseOrder.id,
          produce_item_id: item.id,
          quantity_ordered: item.quantity,
        });
      }
    }
    await trx.commit();
    res.status(201).json({ data: { id: purchaseOrder.id } });
  } catch (error) {
    await trx.rollback();
    console.error("Error creating Purchase Order:", error);
    res.status(500).json({ error: "Failed to create Purchase Order" });
  }
};

// Get all Purchase Orders
export const getPurchaseOrders = async (_req: Request, res: Response) => {
  try {
    const purchaseOrders = await db("pfp_purchase_orders as p")
      .leftJoin("pfp_suppliers as s", "p.supplier_id", "s.id")
      .select(
        "p.id",
        "p.po_number",
        "p.date_created",
        "p.eta_date",
        "p.status",
        "p.note",
        "p.created_at",
        "p.updated_at",
        db.raw(`
          CASE 
            WHEN s.id IS NOT NULL THEN 
              json_build_object(
                'id', s.id,
                'name', s.name
              )
            ELSE NULL 
          END as supplier
        `)
      )
      .orderBy("p.date_created", "desc");

    // Get items for each purchase order
    const purchaseOrdersWithItems = await Promise.all(
      purchaseOrders.map(async (po) => {
        const items = await db("pfp_purchase_order_items as poi")
          .leftJoin("pfp_produce_items as i", "poi.produce_item_id", "i.id")
          .select(
            "i.*",
            "poi.quantity_ordered",
            "poi.quantity_received",
            db.raw("poi.status as item_status")
          )
          .where("poi.purchase_order_id", po.id);

        return {
          ...po,
          items,
        };
      })
    );

    res.json({ data: purchaseOrdersWithItems });
  } catch (error) {
    console.error("Error fetching Purchase Orders:", error);
    res.status(500).json({ error: "Failed to fetch Purchase Orders" });
  }
};

// Get single Purchase Order (with items)
export const getPurchaseOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const purchaseOrder = await db("pfp_purchase_orders as p")
      .leftJoin("pfp_suppliers as s", "p.supplier_id", "s.id")
      .select(
        "p.id",
        "p.po_number",
        "p.date_created",
        "p.eta_date",
        "p.status",
        "p.note",
        "p.created_at",
        "p.updated_at",
        db.raw(`
          CASE 
            WHEN s.id IS NOT NULL THEN 
              json_build_object(
                'id', s.id,
                'name', s.name
              )
            ELSE NULL 
          END as supplier
        `)
      )
      .where("p.id", id)
      .first();

    if (!purchaseOrder) {
      res.status(404).json({ error: "Purchase Order not found" });
      return;
    }

    const items = await db("pfp_purchase_order_items as poi")
      .leftJoin("pfp_produce_items as i", "poi.produce_item_id", "i.id")
      .select(
        "i.*",
        "poi.quantity_ordered",
        "poi.quantity_received",
        db.raw("poi.status as item_status")
      )
      .where("poi.purchase_order_id", id);

    res.json({ data: { purchaseOrder, items } });
  } catch (error) {
    console.error("Error fetching Purchase Order:", error);
    res.status(500).json({ error: "Failed to fetch Purchase Order" });
  }
};

// Update Purchase Order (dynamic fields, replace items)
export const updatePurchaseOrder = async (req: Request, res: Response) => {
  const trx = await db.transaction();
  try {
    const { id } = req.params;
    const allowedFields = [
      "po_number",
      "date_created",
      "eta_date",
      "supplier_id",
      "status",
      "note",
    ];
    const updateFields: Record<string, any> = {};
    allowedFields.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        updateFields[key] = req.body[key];
      }
    });
    updateFields["updated_at"] = db.fn.now();
    if (Object.keys(updateFields).length === 1) {
      res.status(400).json({ error: "No valid fields provided for update." });
      return;
    }
    await trx("pfp_purchase_orders").where({ id }).update(updateFields);
    // Replace PO items if provided
    if (Array.isArray(req.body.items)) {
      await trx("pfp_purchase_order_items")
        .where({ purchase_order_id: id })
        .del();
      for (const item of req.body.items) {
        await trx("pfp_purchase_order_items").insert({
          purchase_order_id: id,
          produce_item_id: item.id,
          quantity_ordered: item.quantity,
        });
      }
    }
    await trx.commit();
    res.json({ data: { message: "Purchase Order updated" } });
  } catch (error) {
    await trx.rollback();
    console.error("Error updating Purchase Order:", error);
    res.status(500).json({ error: "Failed to update Purchase Order" });
  }
};

// Delete Purchase Order
export const deletePurchaseOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db("pfp_purchase_orders").where({ id }).del();
    res.json({ data: { message: "Purchase Order deleted" } });
  } catch (error) {
    console.error("Error deleting Purchase Order:", error);
    res.status(500).json({ error: "Failed to delete Purchase Order" });
  }
};

// Delete multiple Purchase Orders
export const deletePurchaseOrders = async (req: Request, res: Response) => {
  const trx = await db.transaction();
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ error: "No valid IDs provided for deletion." });
      return;
    }

    // Delete purchase order items first to respect foreign key constraints
    await trx("pfp_purchase_order_items")
      .whereIn("purchase_order_id", ids)
      .del();

    // Delete purchase orders
    const deletedCount = await trx("pfp_purchase_orders")
      .whereIn("id", ids)
      .del();

    await trx.commit();
    res.json({
      data: { message: `Successfully deleted ${deletedCount} purchase orders` },
    });
  } catch (error) {
    await trx.rollback();
    console.error("Error deleting Purchase Orders:", error);
    res.status(500).json({ error: "Failed to delete Purchase Orders" });
  }
};
