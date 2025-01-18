import express from "express";
import resolveUserByIdMiddleware from "../middleware/resolveUserById.mjs";
import { USERS } from "../mockData/users.mjs";
import { userCreateValidationSchema } from "../validators/schemas.mjs";
import { matchedData, validationResult, checkSchema } from "express-validator";

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
  
  router.post("/", checkSchema(userCreateValidationSchema), (req, res) => {
    const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const data = matchedData(req);
  
      const { username, displayName } = data;
      const newUser = { id: USERS.length + 1, username, displayName };
  
      USERS.push(newUser);
  
      res.status(201).json(newUser);
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
