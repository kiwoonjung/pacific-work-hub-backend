import pool from "../config/db.js";

export const createUser = async (req, res) => {
  try {
    const {
      azure_id,
      email,
      full_name,
      display_name,
      photo_url,
      job_title,
      department,
      role,
    } = req.body;

    // console.log(req.body);

    if (!azure_id || !display_name || !email) {
      return res.status(400).json({
        error: "Azure ID, Display Name and Email are required.",
      });
    }

    // 🔹 Upsert Logic (Insert if new, update if exists)
    const query = `
        INSERT INTO users (azure_id, email, full_name, display_name, photo_url, job_title, department, role, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
        ON CONFLICT (azure_id) 
        DO UPDATE SET 
          email = EXCLUDED.email,
          full_name = EXCLUDED.full_name,
          display_name = EXCLUDED.display_name,
          photo_url = EXCLUDED.photo_url,
          job_title = EXCLUDED.job_title,
          department = EXCLUDED.department,
          role = EXCLUDED.role,
          updated_at = CURRENT_TIMESTAMP;
      `;

    await pool.query(query, [
      azure_id,
      email,
      full_name,
      display_name,
      photo_url,
      job_title,
      department,
      role,
    ]);

    res.status(200).json({ message: "User created/updated successfully." });
  } catch (error) {
    console.error("Error during create/update user", error);
    res.status(500).json({ error: error.message });
  }
};

// export const updateUser = async (req, res) => {
//   try {
//     const {
//       azure_id,
//       photo_url,
//       display_name,
//       full_name,
//       job_title,
//       department,
//       role,
//     } = req.body;

//     if (!azure_id) {
//       return res.status(400).json({ error: "Azure ID is required." });
//     }

//     await pool.query(
//       `UPDATE users SET
//           photo_url = $1,
//           display_name = $2,
//           full_name = $3,
//           job_title = $4,
//           department = $5,
//           role = $6,
//           updated_at = CURRENT_TIMESTAMP
//           WHERE azure_id = $7;`,
//       [
//         photo_url,
//         display_name,
//         full_name,
//         job_title,
//         department,
//         role || "employee",
//         azure_id,
//       ]
//     );

//     res.status(200).json({ message: "User updated successfully." });
//   } catch (error) {
//     console.error("Error during update user", error);
//     res.status(500).json({ error: error.message });
//   }
// };
