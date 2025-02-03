import loggingMiddleware from "../../middlewares/logging.mjs";

describe("Logging Middleware", () => {
  beforeEach(() => {
    // Mock console.log before each test
    console.log = jest.fn();
  });

  test("should log the request method and URL", () => {
    const req = {
      method: "GET",
      url: "/test",
    };
    const res = {};
    const next = jest.fn();

    loggingMiddleware(req, res, next);

    expect(console.log).toHaveBeenCalledWith("GET /test");
    expect(next).toHaveBeenCalled();
  });
});
