import { matchedData, validationResult } from "express-validator";
import { register } from "../handlers/auth.mjs";
import { hashPassword } from "../utils/auth.mjs";

jest.mock("express-validator", () => ({
  checkSchema: jest.fn(),
  matchedData: jest.fn(),
  validationResult: jest.fn(),
}));

jest.mock("../utils/auth.mjs", () => ({
  hashPassword: jest.fn(),
}));

describe("Register Handler", () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockRequest = {
      body: {
        username: "testuser",
        password: "password123",
      },
      isAuthenticated: jest.fn(),
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  test("should return 400 when user is authenticated", async () => {
    mockRequest.isAuthenticated.mockReturnValue(true);

    await register(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "You must be logged out to register",
    });
  });

  test("should return 400 when validation fails", async () => {
    mockRequest.isAuthenticated.mockReturnValue(false);
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [
        {
          param: "username",
          msg: "Username is required",
        },
      ],
    });

    await register(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: {
        param: "username",
        msg: "Username is required",
      },
    });
  });

  test("should return 500 when hashing password fails", async () => {
    mockRequest.isAuthenticated.mockReturnValue(false);

    validationResult.mockReturnValue({
      isEmpty: () => true,
    });

    matchedData.mockReturnValue({
      username: "testuser",
      password: "password123",
      displayName: "Test User",
    });

    hashPassword.mockRejectedValue(new Error("Hashing failed"));

    await register(mockRequest, mockResponse);

    expect(matchedData).toHaveBeenCalledWith(mockRequest);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Error creating user: Error: Hashing failed",
    });
  });
});
