import express from "express";
import { PRODUCTS } from "../mockData/products.mjs";
import { isAuthenticated } from "../middlewares/auth.mjs";

const router = express.Router();

router.get("/", isAuthenticated, (req, res) => {
  res.json(PRODUCTS);
});

export default router;
