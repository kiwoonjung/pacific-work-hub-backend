import pool from "../config/db.js";

export const createUser = async (req, res) => {
  try {
    const {
      azure_id,
      email,
      first_name,
      last_name,
      photo_url,
      job_title,
      department,
    } = req.body;

    console.log(req.body);

    if (!azure_id || !first_name || !last_name) {
      return res
        .status(400)
        .json({ error: "Azure Id, First Name and Last Name are required." });
    }

    const result = await pool.query(
      `INSERT INTO users
        (azure_id, email, first_name, last_name, photo_url, job_title, department)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (azure_id) DO UPDATE
        SET email = EXCLUDED.email,
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            photo_url = EXCLUDED.photo_url,
            job_title = EXCLUDED.job_title,
            department = EXCLUDED.department
      RETURNING *`,
      [azure_id, email, first_name, last_name, photo_url, job_title, department]
    );

    res.status(200).json({
      message: "User upserted successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error during upsert user", error);
    res.status(500).json({ error: error.message });
  }
};
