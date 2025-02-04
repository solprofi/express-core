import User from "../mongoose/schemas/user.js";

export const getAllUsers = async (req, res) => {
  const { filterKey, filterValue } = req.query;

  const users = await User.find({}).select("username displayName");

  if (!filterKey || !filterValue) {
    return res.json(users);
  }

  const filteredUsers = users.filter((user) =>
    user[filterKey]
      ?.toString()
      .toLowerCase()
      .includes(filterValue.toLowerCase())
  );

  res.json(filteredUsers);
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    res.json(user);
  } catch (error) {
    return res.status(500).json({ message: "Failed to get user" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    const { username, displayName } = req.body;

    if (!username || !displayName) {
      return res
        .status(400)
        .json({ message: "Username and display name are required" });
    }

    user.username = username;
    user.displayName = displayName;

    await user.save();

    const userObject = user.toObject();
    delete userObject.password;

    res.json(userObject);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update user" });
  }
};

export const patchUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    const { username, displayName } = req.body;

    if (username) {
      user.username = username;
    }

    if (displayName) {
      user.displayName = displayName;
    }

    await user.save();

    const userObject = user.toObject();
    delete userObject.password;

    res.json(userObject);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update user" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();
    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete user" });
  }
};
