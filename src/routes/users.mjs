import express from "express";
import { isAuthenticated } from "../middlewares/auth.mjs";
import {
  getAllUsers,
  getUserById,
  updateUser,
  patchUser,
  deleteUser,
} from "../controllers/users.mjs";
import {
  authUpdateUser,
  hasRole,
  authGetUser,
  authDeleteUser,
} from "../middlewares/auth.mjs";
import { ROLES } from "../common/constants.mjs";

const router = express.Router();

router.get("/", isAuthenticated, hasRole([ROLES.ADMIN]), getAllUsers);
router.get("/:id", isAuthenticated, authGetUser, getUserById);
router.put("/:id", isAuthenticated, authUpdateUser, updateUser);
router.patch("/:id", isAuthenticated, authUpdateUser, patchUser);
router.delete("/:id", isAuthenticated, authDeleteUser, deleteUser);

export default router;
