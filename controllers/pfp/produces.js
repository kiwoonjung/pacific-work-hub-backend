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

    const result = await pool.query(
      `INSERT INTO pfp_produce_items 
          (item_no, common_name, origin, size, weight, scientific_name, package_type)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *`,
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

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error during create product item", error);
    res.status(500).json({ error: error.message });
  }
};
