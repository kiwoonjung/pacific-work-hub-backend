import express from "express";
import { createUser } from "../controllers/users.js";

const router = express.Router();

/* GET */

/* POST */
router.post("/create-user", createUser);

/* PUT */
// router.put("/update-user", updateUser);

/* DELETE */

export default router;
