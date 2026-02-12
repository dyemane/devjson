import { describe, it, expect } from "vitest";
import { safeJsonParse, isBigIntValue, unwrapBigInt, BIGINT_PREFIX } from "./safe-json";

describe("safeJsonParse", () => {
  it("parses normal JSON without changes", () => {
    const result = safeJsonParse('{"name":"test","count":42}');
    expect(result).toEqual({ name: "test", count: 42 });
  });

  it("preserves safe integers", () => {
    const result = safeJsonParse('{"id":9007199254740991}');
    expect(result).toEqual({ id: 9007199254740991 });
  });

  it("wraps unsafe integers with sentinel", () => {
    const result = safeJsonParse('{"id":9007199254740993}') as Record<string, unknown>;
    expect(isBigIntValue(result.id)).toBe(true);
    expect(unwrapBigInt(result.id as string)).toBe("9007199254740993");
  });

  it("wraps negative unsafe integers", () => {
    const result = safeJsonParse('{"id":-9007199254740993}') as Record<string, unknown>;
    expect(isBigIntValue(result.id)).toBe(true);
    expect(unwrapBigInt(result.id as string)).toBe("-9007199254740993");
  });

  it("handles unsafe integers in arrays", () => {
    const result = safeJsonParse('[9007199254740993,42]') as unknown[];
    expect(isBigIntValue(result[0])).toBe(true);
    expect(unwrapBigInt(result[0] as string)).toBe("9007199254740993");
    expect(result[1]).toBe(42);
  });

  it("does not wrap floats", () => {
    const result = safeJsonParse('{"val":1234567890.123456}');
    expect(result).toEqual({ val: 1234567890.123456 });
  });

  it("does not wrap strings that look like numbers", () => {
    const result = safeJsonParse('{"id":"9007199254740993"}');
    expect(result).toEqual({ id: "9007199254740993" });
  });

  it("handles Snowflake-style IDs", () => {
    const result = safeJsonParse('{"snowflake_id":1234567890123456789}') as Record<string, unknown>;
    expect(isBigIntValue(result.snowflake_id)).toBe(true);
    expect(unwrapBigInt(result.snowflake_id as string)).toBe("1234567890123456789");
  });
});

describe("isBigIntValue", () => {
  it("returns true for sentinel-prefixed strings", () => {
    expect(isBigIntValue(`${BIGINT_PREFIX}123`)).toBe(true);
  });

  it("returns false for regular strings", () => {
    expect(isBigIntValue("123")).toBe(false);
    expect(isBigIntValue("hello")).toBe(false);
  });

  it("returns false for non-strings", () => {
    expect(isBigIntValue(123)).toBe(false);
    expect(isBigIntValue(null)).toBe(false);
  });
});

describe("unwrapBigInt", () => {
  it("strips the sentinel prefix", () => {
    expect(unwrapBigInt(`${BIGINT_PREFIX}9007199254740993`)).toBe("9007199254740993");
  });
});
