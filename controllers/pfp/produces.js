import pool from "../../config/db.js";

export const getProduceItems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const perPage = parseInt(req.query.perPage) || 10;

    // Get total number of items first
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM pfp_produce_items`
    );
    const totalItems = parseInt(countResult.rows[0].count);

    // Calculate total pages correctly
    const totalPages = Math.ceil(totalItems / perPage);

    // Calculate offset correctly for the last page
    const offset = Math.min(page * perPage, totalItems - perPage);

    // console.log("Pagination details:", {
    //   page,
    //   perPage,
    //   offset,
    //   totalItems,
    //   totalPages,
    // });

    // Get paginated items with proper ordering
    const itemsResult = await pool.query(
      `WITH ordered_items AS (
         SELECT *, 
                ROW_NUMBER() OVER (ORDER BY id DESC) as row_num
         FROM pfp_produce_items
       )
       SELECT * FROM ordered_items
       WHERE row_num > $1 AND row_num <= $2
       ORDER BY id DESC`,
      [offset, offset + perPage]
    );

    // Log the IDs we're returning
    const returnedIds = itemsResult.rows.map((row) => row.id);
    // console.log("Returned IDs:", returnedIds);

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

// Get a single item
export const getSingleProduceItem = async (req, res) => {
  try {
    const { id } = req.params; // <-- Change from req.body to req.params

    const itemResult = await pool.query(
      `SELECT * FROM pfp_produce_items WHERE id = $1`,
      [id]
    );

    res.status(200).json({
      data: itemResult.rows[0], // Usually you want the row, not the metadata
    });
  } catch (error) {
    console.error("Error during get single produce item", error);
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

    // Get the updated list with pagination
    const result = await pool.query(
      `SELECT * FROM pfp_produce_items ORDER BY id DESC LIMIT $1 OFFSET $2`,
      [
        req.query.perPage || 10,
        ((req.query.page || 1) - 1) * (req.query.perPage || 10),
      ]
    );

    // Get total count for pagination
    const countResult = await pool.query(
      "SELECT COUNT(*) FROM pfp_produce_items"
    );

    res.status(201).json({
      items: result.rows,
      totalItems: parseInt(countResult.rows[0].count),
      totalPages: Math.ceil(
        parseInt(countResult.rows[0].count) / (req.query.perPage || 10)
      ),
    });
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
      type_of_package,
    } = req.body;

    console.log(req.body);

    if (!id || !item_no || !common_name) {
      return res
        .status(400)
        .json({ error: "Item No, and Common Name are required." });
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
          type_of_package = $7
        WHERE id = $8`,
      [
        item_no,
        common_name,
        origin,
        size,
        weight,
        scientific_name,
        type_of_package,
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
