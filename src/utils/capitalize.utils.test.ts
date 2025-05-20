import { describe, test, expect } from "bun:test";

import { capitalize } from "./capitalize.utils";

describe("capitalize utility function", () => {
  test("should capitalize the first letter of a lowercase string", () => {
    expect(capitalize("hello")).toBe("Hello");
    expect(capitalize("world")).toBe("World");
    expect(capitalize("test")).toBe("Test");
  });

  test("should keep already capitalized strings unchanged", () => {
    expect(capitalize("Hello")).toBe("Hello");
    expect(capitalize("World")).toBe("World");
    expect(capitalize("Test")).toBe("Test");
  });

  test("should handle empty string", () => {
    expect(capitalize("")).toBe("");
  });

  test("should handle single character", () => {
    expect(capitalize("a")).toBe("A");
    expect(capitalize("z")).toBe("Z");
    expect(capitalize("A")).toBe("A");
  });

  test("should only capitalize the first letter of a sentence", () => {
    expect(capitalize("hello world")).toBe("Hello world");
    expect(capitalize("this is a test")).toBe("This is a test");
  });

  test("should handle strings with numbers at the beginning", () => {
    expect(capitalize("1st place")).toBe("1st place");
    expect(capitalize("2nd test")).toBe("2nd test");
  });

  test("should handle strings with special characters at the beginning", () => {
    expect(capitalize("_hello")).toBe("_hello");
    expect(capitalize("-test")).toBe("-test");
    expect(capitalize("!exclamation")).toBe("!exclamation");
  });

  test("should preserve case of other characters", () => {
    expect(capitalize("hELLO")).toBe("HELLO");
    expect(capitalize("tEST")).toBe("TEST");
    expect(capitalize("camelCase")).toBe("CamelCase");
  });
});
