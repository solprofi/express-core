import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import dotenv from "dotenv";
import loggingMiddleware from "./middlewares/logging.mjs";
import errorHandlingMiddleware from "./middlewares/errorHandler.mjs";
import router from "./routes/index.mjs";
import passport from "passport";
import connectDb from "./config/dbConnection.mjs";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";

// import './strategies/local.mjs';
import './strategies/discord.mjs';

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDb();

// Set up configuration constants from environment variables with fallbacks
const PORT = process.env.PORT || 3000;
const COOKIE_SECRET = process.env.COOKIE_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;

// Create Express application instance
const app = express();

// Enable JSON parsing middleware for request bodies
app.use(express.json());
// Enable cookie parsing middleware with signing capability
app.use(cookieParser(COOKIE_SECRET));
// Set up the session infrastructure
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something stored
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Cookie expires after 24 hours
      httpOnly: true, // Prevents client side JS from reading the cookie 
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
      ttl: 60 * 60 * 24, // 1 day
    }),
  })
);

// Initialize Passport authentication middleware
app.use(passport.initialize());
// Enable persistent login sessions
app.use(passport.session());

// Apply custom logging middleware
app.use(loggingMiddleware);
// Apply error handling middleware
app.use(errorHandlingMiddleware);

// Mount all API routes under /api path
app.use("/api", router);

// Test route to simulate login
app.get("/", (req, res) => {
  // Set mock authentication state
  req.session.isMockedLoggedIn = true;

  res.json({ message: "TEST ROUTE" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
