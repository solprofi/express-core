import express from "express";
import usersRouter from "./users.mjs";
import productsRouter from "./products.mjs";

const router = express.Router();

router.use("/users", usersRouter);
router.use("/products", productsRouter);

export default router;
