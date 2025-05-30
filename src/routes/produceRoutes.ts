import express from "express";
import {
  getProduces,
  getProduceById,
  createProduce,
  updateProduce,
  deleteProduceById,
  deleteProducesBatch,
} from "../controllers/pfp/produceController";

const router = express.Router();

/* GET all active produce items */
router.get("/active", (req, res, next) => {
  req.query.status = "active";
  getProduces(req, res).catch(next);
});

/* GET all produce items */
router.get("/", getProduces);

/* GET a single produce item by ID */
router.get("/:id", getProduceById);

/* POST a new produce item */
router.post("/", createProduce);

/* PUT (update) an existing produce item */
router.put("/:id", updateProduce);

/* DELETE a single produce item by ID */
router.delete("/:id", deleteProduceById);
router.delete("/", deleteProducesBatch);

export default router;
