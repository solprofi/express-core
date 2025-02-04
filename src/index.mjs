import dotenv from "dotenv";
import connectDb from "./config/dbConnection.mjs";
import createApp from "./createApp.mjs";

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDb();

const app = createApp();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
