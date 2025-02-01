import express from "express";
import passport from "passport";

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

export default router;
