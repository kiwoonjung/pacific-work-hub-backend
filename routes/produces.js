import express from "express";
import { createProduceItem } from "../controllers/pfp/produces.js";

const router = express.Router();

/* POST */
router.post("/create-produce-item", createProduceItem);

export default router;
