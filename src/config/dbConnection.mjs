import mongoose from "mongoose";

const connectDb = async () => {
  try {
    // For test environment, use the full URI provided by MongoMemoryServer
    const dbUri =
      process.env.NODE_ENV === "test"
        ? process.env.CONNECTION_STRING_TEST
        : process.env.CONNECTION_STRING;

    const connect = await mongoose.connect(dbUri);

    console.log(
      "Database connected:",
      connect.connection.host,
      connect.connection.name
    );

    return connect;
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

export const disconnectDb = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
};

export default connectDb;
