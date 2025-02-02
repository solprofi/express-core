import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../mongoose/schemas/user.js";
import { comparePassword } from "../utils/helpers.mjs";

// Serialize user object to store in session
// Only store user.id in the session to keep it light 
// and avoid storing sensitive or stale data
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session (turn the stored id back into a user object)
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id).select('-password');

  
  done(null, user);
});

// Configure and export local authentication strategy
export default passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
  
      // Find user in mock database by username
      const user = await User.findOne({ username });

      // If no user found, return error
      if (!user) {
        return done(null, false, { message: 'User not found' });
      }

      // If password doesn't match, return error
      if (!(await comparePassword(password, user.password))) {
        return done(null, false, { message: 'Invalid password' });
      }
        
      // If authentication successful, return user object 
      // to be called in serializeUser
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));
