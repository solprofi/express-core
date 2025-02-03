import errorHandlingMiddleware from "../../middlewares/errorHandler.mjs";

describe("Error Handling Middleware", () => {
  beforeEach(() => {
    console.error = jest.fn();
  });

  test("should log error and return 500 status with error message", () => {
    const err = new Error("Test error");
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    errorHandlingMiddleware(err, req, res, next);

    expect(console.error).toHaveBeenCalledWith(err);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal server error",
    });
  });

  test("should handle different types of errors", () => {
    const errors = [
      new TypeError("Type error"),
      "String error",
      { custom: "error" },
    ];

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    errors.forEach((err) => {
      errorHandlingMiddleware(err, req, res, next);
      expect(console.error).toHaveBeenCalledWith(err);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });
});
