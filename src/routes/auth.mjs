import express from "express";
import { checkSchema } from "express-validator";
import { userCreateValidationSchema } from "../validators/schemas.mjs";
import {
  login,
  getAuthStatus,
  logout,
  register,
  discordAuth,
  discordAuthRedirect,
} from "../handlers/auth.mjs";

const router = express.Router();

router.post("/login", login);
router.get("/status", getAuthStatus);
router.post("/logout", logout);
router.post("/register", checkSchema(userCreateValidationSchema), register);
router.get("/discord", discordAuth);
router.get("/discord/redirect", discordAuthRedirect);

export default router;
