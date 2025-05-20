import { describe, test, expect } from "bun:test";

import { pFloat } from "./p-float.utils";

describe("pFloat utility function", () => {
  test("should return the same value when input is a number", () => {
    expect(pFloat(42)).toBe(42);
    expect(pFloat(3.14)).toBe(3.14);
    expect(pFloat(-10.5)).toBe(-10.5);
    expect(pFloat(0)).toBe(0);
  });

  test("should parse string with dots correctly", () => {
    expect(pFloat("42")).toBe(42);
    expect(pFloat("3.14")).toBe(3.14);
    expect(pFloat("-10.5")).toBe(-10.5);
    expect(pFloat("0")).toBe(0);
  });

  test("should convert commas to dots and parse correctly", () => {
    expect(pFloat("3,14")).toBe(3.14);
    expect(pFloat("-10,5")).toBe(-10.5);
    expect(pFloat("1,234,567")).toBe(1.234);
  });

  test("should return NaN for undefined input", () => {
    expect(Number.isNaN(pFloat(undefined))).toBe(true);
  });

  test("should handle invalid string input", () => {
    expect(Number.isNaN(pFloat("not a number"))).toBe(true);
    expect(Number.isNaN(pFloat(""))).toBe(true);
    expect(pFloat("42abc")).toBe(42); // parseFloat behavior
  });

  test("should handle string with leading/trailing whitespace", () => {
    expect(pFloat("  42  ")).toBe(42);
    expect(pFloat(" 3.14 ")).toBe(3.14);
    expect(pFloat(" -10,5 ")).toBe(-10.5);
  });

  test("should parse only the first valid number in a string", () => {
    expect(pFloat("42.5 is the answer")).toBe(42.5); // parseFloat behavior
    expect(Number.isNaN(pFloat("price: 99.99"))).toBe(true);
  });
});
