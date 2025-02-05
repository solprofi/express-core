import { matchedData, validationResult } from "express-validator";
import { register } from "../controllers/auth.mjs";
import { hashPassword } from "../utils/auth.mjs";
import User from "../mongoose/schemas/user.js";

jest.mock("../mongoose/schemas/user.js", () => {
  const mockSave = jest.fn().mockResolvedValue(undefined);
  const mockToObject = jest.fn().mockReturnValue({
    username: "testuser",
    displayName: "Test User",
  });

  const MockUser = jest.fn().mockImplementation(() => ({
    save: mockSave,
    toObject: mockToObject,
  }));

  return { __esModule: true, default: MockUser };
});

jest.mock("express-validator", () => ({
  checkSchema: jest.fn(),
  matchedData: jest.fn().mockReturnValue({
    username: "testuser",
    password: "password123",
    displayName: "Test User",
  }),
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
    jest.clearAllMocks();
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

    hashPassword.mockRejectedValue(new Error("Hashing failed"));

    await register(mockRequest, mockResponse);

    expect(matchedData).toHaveBeenCalledWith(mockRequest);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Error creating user: Error: Hashing failed",
    });
  });

  test("should return 201 when user is created", async () => {
    mockRequest.isAuthenticated.mockReturnValue(false);

    validationResult.mockReturnValue({
      isEmpty: () => true,
    });

    hashPassword.mockResolvedValue("hashedPassword");

    await register(mockRequest, mockResponse);

    expect(User).toHaveBeenCalledWith({
      username: "testuser",
      password: "hashedPassword",
      displayName: "Test User",
    });

    const mockUserInstance = User.mock.results[0].value;
    expect(mockUserInstance.save).toHaveBeenCalled();

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      username: "testuser",
      displayName: "Test User",
    });
  });
});
