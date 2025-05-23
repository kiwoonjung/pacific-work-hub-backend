import { Request, Response } from "express";
import { QueryResult } from "pg";
import pool from "../../config/db";

// import { ProduceRow } from "types/produce.js";

export const getProduces = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const itemsResult = await pool.query(
      `SELECT * FROM pfp_produce_items
        ORDER BY created_at DESC`
    );
    res.status(200).json({ items: itemsResult.rows });
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

    const itemResult = await pool.query(
      `SELECT * FROM pfp_produce_items WHERE id = $1`,
      [id]
    );

    res.status(200).json({
      data: itemResult.rows[0],
    });
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
    } = req.body;

    if (!item_no || !common_name) {
      res.status(400).json({ error: "Item No and Common Name are required." });
      return;
    }

    // Insert new item
    await pool.query(
      `INSERT INTO pfp_produce_items 
        (item_no, common_name, origin, size, weight, weight_unit, scientific_name, package_type)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        item_no,
        common_name,
        origin,
        size,
        weight,
        weight_unit,
        scientific_name,
        package_type,
      ]
    );

    // Get the updated list with pagination
    const result = await pool.query(
      `SELECT * FROM pfp_produce_items ORDER BY created_at DESC`
    );

    res.status(201).json({ produceId: result.rows[0].id });
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
    const {
      item_no,
      common_name,
      origin,
      size,
      weight,
      weight_unit,
      scientific_name,
      package_type,
    } = req.body;

    if (!item_no || !common_name) {
      res.status(400).json({ error: "Item No, and Common Name are required." });
      return;
    }

    // Update the item
    await pool.query(
      `UPDATE pfp_produce_items
        SET item_no = $1,
          common_name = $2,
          origin = $3,
          size = $4,
          weight = $5,
          weight_unit= $6,
          scientific_name = $7,
          package_type = $8
        WHERE id = $9`,
      [
        item_no,
        common_name,
        origin,
        size,
        weight,
        weight_unit,
        scientific_name,
        package_type,
        id,
      ]
    );

    res.status(200).json({ message: "Site updated successfully" });
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

    const result = await pool.query(
      `DELETE FROM pfp_produce_items WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: "Item not found." });
      return;
    }

    res.status(200).json({ message: "The item was deleted!" });
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

    // Check user existence
    // const userResult = await pool.query(`SELECT id FROM users WHERE id = $1`, [
    //   userId,
    // ]);
    // if (userResult.rows.length === 0) {
    //   res.status(404).json({ error: "User not found" });
    //   return;
    // }

    // Batch delete
    const deleteQuery = `DELETE FROM pfp_produce_items WHERE id = ANY($1::uuid[])`;
    await pool.query(deleteQuery, [ids]);

    res
      .status(200)
      .json({ message: "Produces deleted successfully", count: ids.length });
  } catch (error) {
    const err = error as Error;
    console.error("Error during batch delete:", error);
    res.status(500).json({ error: err.message });
  }
};
