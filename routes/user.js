import express from "express";
import { createUser } from "../controllers/user.js";

const router = express.Router();

/* GET */
/* POST */
router.post("/create-user", createUser);
/* PUT */
/* DELETE */

export default router;
