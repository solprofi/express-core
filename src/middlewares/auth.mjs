import {
  canUpdateUser,
  canGetUser,
  canDeleteUser,
} from "../permissions/users.mjs";

export const isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      status: "error",
      message: "You must be logged in to access this resource",
    });
  }

  next();
};

export const hasRole = (roles) => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};

export const authUpdateUser = (req, res, next) => {
  if (!canUpdateUser(req.user, req.body)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
};

export const authGetUser = (req, res, next) => {
  if (!canGetUser(req.user, req.params.id)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
};

export const authDeleteUser = (req, res, next) => {
  if (!canDeleteUser(req.user, req.params.id)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
};
