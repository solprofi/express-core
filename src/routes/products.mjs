import express from "express";
import { PRODUCTS } from "../mockData/products.mjs";

const router = express.Router();

router.get("/", (req, res) => {
  res.json(PRODUCTS);
});

export default router;
