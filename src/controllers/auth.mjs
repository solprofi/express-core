import passport from "passport";
import { hashPassword } from "../utils/auth.mjs";
import User from "../mongoose/schemas/user.js";
import { matchedData, validationResult } from "express-validator";

export const login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({ message: info.message });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      return res.json({ message: "Login successful" });
    });
  })(req, res, next);
};

export const getAuthStatus = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  res.json(req.user);
};

export const logout = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }

    res.sendStatus(200);
  });
};

export const register = async (req, res) => {
  if (req.isAuthenticated()) {
    return res
      .status(400)
      .json({ message: "You must be logged out to register" });
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()?.[0] });
  }

  const { username, displayName, password, role } = matchedData(req);

  try {
    const hashedPassword = await hashPassword(password);

    const user = new User({
      username,
      displayName,
      password: hashedPassword,
      role,
    });
    await user.save();

    const userObject = user.toObject();
    delete userObject.password;

    res.status(201).json(userObject);
  } catch (error) {
    return res.status(500).json({ message: "Error creating user: " + error });
  }
};

export const discordAuth = passport.authenticate("discord");

export const discordAuthRedirect = passport.authenticate("discord", {
  successRedirect: "/api/auth/status",
  failureRedirect: "/login",
});
