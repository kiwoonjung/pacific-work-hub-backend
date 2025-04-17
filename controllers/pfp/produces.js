import pool from "../../config/db.js";

// Create a produce item
export const createProduceItem = async (req, res) => {
  try {
    const {
      item_no,
      common_name,
      origin,
      size,
      weight,
      scientific_name,
      package_type,
    } = req.body;

    if (!item_no || !common_name) {
      return res
        .status(400)
        .json({ error: "Item No and Common Name are required." });
    }

    // Insert new item
    await pool.query(
      `INSERT INTO pfp_produce_items 
        (item_no, common_name, origin, size, weight, scientific_name, package_type)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        item_no,
        common_name,
        origin,
        size,
        weight,
        scientific_name,
        package_type,
      ]
    );

    // Get the updated list
    const result = await pool.query(
      `SELECT * FROM pfp_produce_items ORDER BY id DESC`
    );

    res.status(201).json(result.rows);
  } catch (error) {
    console.error("Error during create produce item", error);
    res.status(500).json({ error: error.message });
  }
};
