import express from "express";
import {
  getProduceItems,
  createProduceItem,
  updateProduceItem,
} from "../controllers/pfp/produces.js";

const router = express.Router();

/* GET */
router.get("/get-produce-items", getProduceItems);

/* POST */
router.post("/create-produce-item", createProduceItem);

/* PUT */
router.put("/update-produce-item", updateProduceItem);

export default router;
