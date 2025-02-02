import express from "express";
import passport from "passport";
import { hashPassword } from "../utils/helpers.mjs";
import User from "../mongoose/schemas/user.js";
import { userCreateValidationSchema } from "../validators/schemas.mjs";
import { matchedData, validationResult, checkSchema } from "express-validator";

const router = express.Router();

router.post("/login", (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
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

      return res.json({ message: 'Login successful' });
    });
  })(req, res, next);
});

router.get("/status", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  res.json(req.user);
});

router.post("/logout", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }

    res.sendStatus(200);
  });
});

router.post("/register", checkSchema(userCreateValidationSchema), async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, displayName, password } = matchedData(req);

  const hashedPassword = await hashPassword(password);

  const user = new User({ username, displayName, password: hashedPassword });

  try {
    await user.save();

    const userObject = user.toObject();
    delete userObject.password;
    
    res.status(201).json(userObject);
  } catch (error) {
    return res.status(500).json({ message: "Error creating user: " + error });
  }
});


export default router;

