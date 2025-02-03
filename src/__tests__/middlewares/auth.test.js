import { isAuthenticated } from "../../middlewares/auth.mjs";

describe("Auth Middleware", () => {
  test("should allow authenticated requests to proceed", () => {
    const req = {
      isAuthenticated: () => true,
    };
    const res = {};
    const next = jest.fn();

    isAuthenticated(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test("should block unauthenticated requests with 401", () => {
    const req = {
      isAuthenticated: () => false,
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    isAuthenticated(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: "You must be logged in to access this resource",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
