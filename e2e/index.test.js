import request from "supertest";
import createApp from "../src/createApp.mjs";
import connectDb, { disconnectDb } from "../src/config/dbConnection.mjs";
import { setupTestDb, clearDatabase, closeDatabase } from "./setup.js";

let app;

beforeAll(async () => {
  await setupTestDb();
  await connectDb();
  app = createApp();
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
  await disconnectDb();
});

describe("Auth API", () => {
  test("POST /api/auth/register - should register new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "testuser",
      password: "password123",
      displayName: "Test User",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("username", "testuser");
  });
});
