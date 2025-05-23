import express from "express";
import { createReceiving } from "../controllers/pfp/receivingController";

const router = express.Router();

/* GET */

/* POST */
router.post("/create-receiving", createReceiving);

/* PUR */

/* DELETE */

export default router;
