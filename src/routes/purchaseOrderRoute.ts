import express from "express";
import {
  createPurchaseOrder,
  getPurchaseOrders,
  getPurchaseOrderById,
  updatePurchaseOrder,
  deletePurchaseOrder,
  deletePurchaseOrders,
} from "../controllers/pfp/purchaseOrderController";

const router = express.Router();

router.post("/", createPurchaseOrder);
router.get("/", getPurchaseOrders);
router.get("/:id", getPurchaseOrderById);
router.put("/:id", updatePurchaseOrder);
router.delete("/:id", deletePurchaseOrder);
router.delete("/", deletePurchaseOrders);

export default router;