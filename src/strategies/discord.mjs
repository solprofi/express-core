import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import dotenv from "dotenv";
import DiscordUser from "../mongoose/schemas/discordUser.js";

dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await DiscordUser.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport.use(new DiscordStrategy({
  clientID: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  callbackURL: "/api/auth/discord/redirect",    
  scope: ["identify", "email"],
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await DiscordUser.findOne({ discordId: profile.id });
    if (user) {
      return done(null, user);
    }
  } catch (error) {
    console.error(error);
    return done(error, false);
  }

  const newUser = new DiscordUser({       
    discordId: profile.id,
    username: profile.username,
    email: profile.email,
  });

  try { 
    await newUser.save();
    return done(null, newUser);
  } catch (error) {
    console.error(error);
    return done(error, false);
  }
}));
