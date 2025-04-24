import pool from "../../config/db.js";

// Get produce items
export const getProduceItems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // default to page 1
    const limit = parseInt(req.query.limit) || 10; // default to 10 items per page
    const offset = (page - 1) * limit;

    // Get total number of items
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM pfp_produce_items`
    );
    const totalItems = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalItems / limit);

    // Get paginated items
    const itemsResult = await pool.query(
      `SELECT * FROM pfp_produce_items
       ORDER BY id DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.status(200).json({
      currentPage: page,
      totalPages,
      totalItems,
      items: itemsResult.rows,
    });
  } catch (error) {
    console.error("Error during get produce items", error);
    res.status(500).json({ error: error.message });
  }
};

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
      type_of_package,
    } = req.body;

    if (!item_no || !common_name) {
      return res
        .status(400)
        .json({ error: "Item No and Common Name are required." });
    }

    // Insert new item
    await pool.query(
      `INSERT INTO pfp_produce_items 
        (item_no, common_name, origin, size, weight, scientific_name, type_of_package)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        item_no,
        common_name,
        origin,
        size,
        weight,
        scientific_name,
        type_of_package,
      ]
    );

    // Get the updated list
    const result = await pool.query(
      `SELECT * FROM pfp_produce_items ORDER BY id DESC`
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error during create produce item", error);
    res.status(500).json({ error: error.message });
  }
};

// Update a produce item
export const updateProduceItem = async (req, res) => {
  try {
    const {
      id,
      item_no,
      common_name,
      origin,
      size,
      weight,
      scientific_name,
      package_type,
    } = req.body;

    console.log(req);

    if (!id || !item_no || !common_name) {
      return res
        .status(400)
        .json({ error: "ID, Item No, and Common Name are required." });
    }

    // Update the item
    await pool.query(
      `UPDATE pfp_produce_items
        SET item_no = $1,
          common_name = $2,
          origin = $3,
          size = $4,
          weight = $5,
          scientific_name = $6,
          package_type = $7
        WHERE id = $8`,
      [
        item_no,
        common_name,
        origin,
        size,
        weight,
        scientific_name,
        package_type,
        id,
      ]
    );

    // Get the updated list
    const result = await pool.query(
      `SELECT * FROM pfp_produce_items ORDER BY id DESC`
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error during update produce item", error);
    res.status(500).json({ error: error.message });
  }
};
