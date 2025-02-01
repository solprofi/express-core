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

export default router;
