import express from "express";
import loggingMiddleware from "./middleware/logging.mjs";
import errorHandlingMiddleware from "./middleware/errorHandler.mjs";
import router from "./routes/index.mjs";
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use(loggingMiddleware);
app.use(errorHandlingMiddleware);

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
