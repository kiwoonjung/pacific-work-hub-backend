import express from "express";
import {
  getProduceItems,
  createProduceItem,
  updateProduceItem,
  getSingleProduceItem,
} from "../controllers/pfp/produces.js";

const router = express.Router();

/* GET */
router.get("/get-produce-items", getProduceItems);
router.get("/get-single-produce-item/:id", getSingleProduceItem);

/* POST */
router.post("/create-produce-item", createProduceItem);

/* PUT */
router.put("/update-produce-item", updateProduceItem);

export default router;
