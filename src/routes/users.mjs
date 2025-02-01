import express from "express";
import resolveUserByIdMiddleware from "../middleware/resolveUserById.mjs";
import { USERS } from "../mockData/users.mjs";
import { userCreateValidationSchema } from "../validators/schemas.mjs";
import { matchedData, validationResult, checkSchema } from "express-validator";
import User from "../mongoose/schemas/user.js";

const router = express.Router();

router.get("/", (req, res) => {
  const { filterKey, filterValue } = req.query;

  if (!filterKey || !filterValue) {
    return res.json(USERS);
  }

  const filteredUsers = USERS.filter((user) =>
    user[filterKey]?.toString().toLowerCase().includes(filterValue.toLowerCase())
  );

  res.json(filteredUsers);
});

router.get("/:id", resolveUserByIdMiddleware, (req, res) => {
  const user = USERS.find((user) => user.id === req.userId);
  res.json(user);
});

router.post("/", async (req, res) => {
  const { username, displayName, password } = req.body;

  const user = new User({ username, displayName, password });

  try {
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Error creating user" });
  }
});

router.put("/:id", resolveUserByIdMiddleware, (req, res) => {
  const user = USERS.find((user) => user.id === req.userId);

  const { username, displayName } = req.body;

  user.username = username;
  user.displayName = displayName;

  res.json(user);
});

router.patch("/:id", resolveUserByIdMiddleware, (req, res) => {
  const user = USERS.find((user) => user.id === req.userId);

  const { username, displayName } = req.body;

  if (username) {
    user.username = username;
  }

  if (displayName) {
    user.displayName = displayName;
  }

  res.json(user);
});

router.delete("/:id", resolveUserByIdMiddleware, (req, res) => {
  const index = USERS.findIndex((user) => user.id === req.userId);

  USERS.splice(index, 1);

  res.sendStatus(204);
});

export default router;
