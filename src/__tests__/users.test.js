describe("Basic Jest Setup", () => {
  test("should pass a simple test", () => {
    expect(true).toBe(true);
  });

  test("should handle basic math", () => {
    expect(1 + 1).toBe(2);
  });

  test("should work with strings", () => {
    const str = "hello world";
    expect(str).toContain("hello");
    expect(str.length).toBe(11);
  });
});
