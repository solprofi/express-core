import express from "express";
import { isAuthenticated } from "../middlewares/auth.mjs";
import {
  getAllUsers,
  getUserById,
  updateUser,
  patchUser,
  deleteUser,
} from "../handlers/users.mjs";

const router = express.Router();

router.get("/", isAuthenticated, getAllUsers);
router.get("/:id", isAuthenticated, getUserById);
router.put("/:id", isAuthenticated, updateUser);
router.patch("/:id", isAuthenticated, patchUser);
router.delete("/:id", isAuthenticated, deleteUser);

export default router;
