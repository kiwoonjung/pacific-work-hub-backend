import express from "express";
import { createUser } from "../controllers/users";

const router = express.Router();

/* GET */
/* POST */
router.post("/", createUser);
/* PUT */
/* DELETE */

export default router;
