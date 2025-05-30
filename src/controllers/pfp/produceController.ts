import { Request, Response } from "express";
import { QueryResult } from "pg";
import db from "../../config/knex";

// import { ProduceRow } from "types/produce.js";

export const getProduces = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status } = req.query;
    let query = db("pfp_produce_items")
      .select("*")
      .orderBy("created_at", "desc");
    if (status) {
      query = query.where({ status });
    }
    const items = await query;
    res.status(200).json({ data: items });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error during get produce items", error);
    res.status(500).json({ error: err.message });
  }
};

// Get a single item
export const getProduceById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;
    const item = await db("pfp_produce_items").where({ id }).first();
    res.status(200).json({ data: item });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error during get single produce item", error);
    res.status(500).json({ error: err.message });
  }
};

// Create a produce item
export const createProduce = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      item_no,
      common_name,
      origin,
      size,
      weight,
      weight_unit,
      scientific_name,
      package_type,
      status,
    } = req.body;

    if (!item_no || !common_name) {
      res.status(400).json({ error: "Item No and Common Name are required." });
      return;
    }

    // Insert new item
    const [produceId] = await db("pfp_produce_items")
      .insert({
        item_no,
        common_name,
        origin,
        size,
        weight,
        weight_unit,
        scientific_name,
        package_type,
        status,
      })
      .returning("id");

    res.status(201).json({ data: { id: produceId.id || produceId } });
  } catch (error) {
    const err = error as Error;
    console.error("Error during create produce item", error);
    res.status(500).json({ error: err.message });
  }
};

// Update a produce item
export const updateProduce = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const allowedFields = [
      "item_no",
      "common_name",
      "origin",
      "size",
      "weight",
      "weight_unit",
      "scientific_name",
      "package_type",
      "status",
    ];
    const updateFields: Record<string, any> = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    if (Object.keys(updateFields).length === 0) {
      res.status(400).json({ error: "No valid fields provided for update." });
      return;
    }

    await db("pfp_produce_items").where({ id }).update(updateFields);

    res.status(200).json({ data: { message: "Produce updated successfully" } });
  } catch (error) {
    const err = error as Error;
    console.error("Error during update produce item", error);
    res.status(500).json({ error: err.message });
  }
};

// Delete a single produce item
export const deleteProduceById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "Item ID is required." });
      return;
    }

    const deleted = await db("pfp_produce_items")
      .where({ id })
      .del()
      .returning("*");

    if (!deleted.length) {
      res.status(404).json({ error: "Item not found." });
      return;
    }

    res.status(200).json({ data: { message: "The item was deleted!" } });
  } catch (error) {
    const err = error as Error;
    console.error("Error during delete single produce item", error);
    res.status(500).json({ error: err.message });
  }
};

export const deleteProducesBatch = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ error: "Invalid or empty 'ids' array." });
      return;
    }

    // Batch delete
    await db("pfp_produce_items").whereIn("id", ids).del();

    res
      .status(200)
      .json({
        data: { message: "Produces deleted successfully", count: ids.length },
      });
  } catch (error) {
    const err = error as Error;
    console.error("Error during batch delete:", error);
    res.status(500).json({ error: err.message });
  }
};
