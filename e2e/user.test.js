import request from "supertest";
import createApp from "../src/createApp.mjs";
import connectDb, { disconnectDb } from "../src/config/dbConnection.mjs";
import { setupTestDb, closeDatabase } from "./setup.js";

let app;
let agent;

beforeAll(async () => {
  await setupTestDb();
  await connectDb();
  app = createApp();
  agent = request.agent(app);
});

afterAll(async () => {
  await closeDatabase();
  await disconnectDb();
});

describe("Auth API", () => {
  test("POST /api/auth/register - should register new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "testuser1",
      password: "password123",
      displayName: "Test User 1",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("username", "testuser1");
  });
});

describe("Create a user and log in", () => {
  test("should create a user", async () => {
    const res = await agent.post("/api/auth/register").send({
      username: "testuser2",
      password: "password123",
      displayName: "Test User 2",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("username", "testuser2");
  });

  test("should log in a user", async () => {
    const res = await agent.post("/api/auth/login").send({
      username: "testuser2",
      password: "password123",
    });

    console.log(res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Login successful");
  });

  test("/api/auth/status should work when logged in", async () => {
    const res = await agent.get("/api/auth/status");

    console.log(res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("username", "testuser2");
  });

  test("logout should clear the session", async () => {
    const res = await agent.post("/api/auth/logout");

    expect(res.statusCode).toBe(200);

    const statusRes = await agent.get("/api/auth/status");
    expect(statusRes.statusCode).toBe(401);
    expect(statusRes.body).toHaveProperty("message", "Not logged in");
  });
});
