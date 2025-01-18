import express from "express";
import { matchedData, validationResult } from "express-validator";
import resolveUserByIdMiddleware from "./middleware/resolveUserById.mjs";
import { USERS } from "./mockData/users.mjs";
import { PRODUCTS } from "./mockData/products.mjs";
import loggingMiddleware from "./middleware/logging.mjs";
import errorHandlingMiddleware from "./middleware/errorHandler.mjs";
import { userCreateValidationSchema } from "./validators/schemas.mjs";
import { checkSchema } from "express-validator";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use(loggingMiddleware);
app.use(errorHandlingMiddleware);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/users", (req, res) => {
  const { filterKey, filterValue } = req.query;

  if (!filterKey || !filterValue) {
    return res.json(USERS);
  }

  const filteredUsers = USERS.filter((user) =>
    user[filterKey]?.toString().toLowerCase().includes(filterValue.toLowerCase())
  );

  res.json(filteredUsers);
});

app.get("/api/users/:id", resolveUserByIdMiddleware, (req, res) => {
  const user = USERS.find((user) => user.id === req.userId);
  res.json(user);
});

app.post(
  "/api/users",
  checkSchema(userCreateValidationSchema),
  (req, res) => {
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

app.put("/api/users/:id", resolveUserByIdMiddleware, (req, res) => {
  const user = USERS.find((user) => user.id === req.userId);

  const { username, displayName } = req.body;

  user.username = username;
  user.displayName = displayName;

  res.json(user);
});

app.patch("/api/users/:id", resolveUserByIdMiddleware, (req, res) => {
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

app.delete("/api/users/:id", resolveUserByIdMiddleware, (req, res) => {
  const index = USERS.findIndex((user) => user.id === req.userId);

  USERS.splice(index, 1);

  res.sendStatus(204);
});

app.get("/api/products", (req, res) => {
  res.json(PRODUCTS);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
