import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { USERS } from "../mockData/users.mjs";

// Serialize user object to store in session
// Only store user.id in the session to keep it light 
// and avoid storing sensitive or stale data
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session (turn the stored id back into a user object)
passport.deserializeUser((id, done) => {
  const user = USERS.find((user) => user.id === id);
  delete user.password;
  
  done(null, user);
});

// Configure and export local authentication strategy
export default passport.use(new LocalStrategy(
  (username, password, done) => {
    // Find user in mock database by username
    const user = USERS.find((user) => user.username === username);

    // If no user found, return error
    if (!user) {
      return done(null, false, { message: 'User not found' });
    }

    // If password doesn't match, return error
    if (user.password !== password) {
      return done(null, false, { message: 'Invalid password' });
    }
    
    // If authentication successful, return user object
    return done(null, user);
  }
));
