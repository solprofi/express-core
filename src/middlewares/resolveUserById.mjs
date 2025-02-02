import { USERS } from "../mockData/users.mjs";

const resolveUserByIdMiddleware = (req, res, next) => {
    const parsedId = parseInt(req.params.id);
    if (isNaN(parsedId)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = USERS.find((user) => user.id === parsedId);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    req.userId = user.id;

    next();
};

export default resolveUserByIdMiddleware;
