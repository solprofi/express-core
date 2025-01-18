import express from "express";
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

const USERS = [
  { id: 1, username: "johndoe", displayName: "John Doe" },
  { id: 2, username: "janedoe", displayName: "Jane Doe" },
  { id: 3, username: "jsmith", displayName: "John Smith" },
  { id: 4, username: "janesmith", displayName: "Jane Smith" },
  { id: 5, username: "robertj", displayName: "Robert Johnson" },
  { id: 6, username: "sarahw", displayName: "Sarah Williams" },
  { id: 7, username: "mikeb", displayName: "Michael Brown" },
  { id: 8, username: "emmad", displayName: "Emma Davis" },
];

const PRODUCTS = [
  { id: 1, name: "Product 1" },
  { id: 2, name: "Product 2" },
  { id: 3, name: "Product 3" },
];

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

app.get("/api/users/:id", (req, res) => {
  const parsedId = parseInt(req.params.id);
  if (isNaN(parsedId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  const user = USERS.find((user) => user.id === parsedId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

app.get("/api/products", (req, res) => {
  res.json(PRODUCTS);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
