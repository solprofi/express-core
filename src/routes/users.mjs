import express from "express";
import { isAuthenticated } from "../middlewares/auth.mjs";
import User from "../mongoose/schemas/user.js";

const router = express.Router();

router.get("/", isAuthenticated, async (req, res) => {
  const { filterKey, filterValue } = req.query;

  const users = await User.find({}).select('username displayName');

  if (!filterKey || !filterValue) {
    return res.json(users);
  }

  const filteredUsers = users.filter((user) =>
    user[filterKey]?.toString().toLowerCase().includes(filterValue.toLowerCase())
  );

  res.json(filteredUsers);
});

router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to get user' });
  }
});

router.put("/:id", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

  const { username, displayName } = req.body;

  user.username = username;
  user.displayName = displayName;

  res.json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update user' });
  }
});

router.patch("/:id", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

  const { username, displayName } = req.body;

  if (username) {
    user.username = username;
  }

  if (displayName) {
    user.displayName = displayName;
  }

  res.json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update user' });
  }
});

router.delete("/:id", isAuthenticated, async (req, res) => {
  const user = await User.findById(req.userId);

  try {
    await user.deleteOne();
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete user' });
  }

  res.sendStatus(204);
});

export default router;
