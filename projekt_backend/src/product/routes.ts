import { Router } from "express";
import verifyToken, { isAdmin } from "../middleware/authMiddleware";
import { getAllProducts, getProductbyId } from "./productController";

const router = Router();
router.get("/product/:id", getProductbyId);
router.get("/products", isAdmin, getAllProducts);

export default router;