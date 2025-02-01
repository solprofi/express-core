import express from "express";
import usersRouter from "./users.mjs";
import productsRouter from "./products.mjs";
import authRouter from "./auth.mjs";

const router = express.Router();

router.use("/users", usersRouter);
router.use("/products", productsRouter);
router.use("/auth", authRouter);

export default router;
