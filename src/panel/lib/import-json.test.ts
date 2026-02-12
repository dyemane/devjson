import { describe, it, expect } from "vitest";
import { parseImportedText } from "./import-json";

describe("parseImportedText", () => {
  it("parses valid JSON object", () => {
    const result = parseImportedText('{"name":"test","value":42}');
    expect(result.error).toBeUndefined();
    expect(result.parsed).toEqual({ name: "test", value: 42 });
    expect(result.label).toContain("Object");
  });

  it("parses valid JSON array", () => {
    const result = parseImportedText("[1, 2, 3]");
    expect(result.error).toBeUndefined();
    expect(result.parsed).toEqual([1, 2, 3]);
    expect(result.label).toContain("Array(3)");
  });

  it("parses primitive JSON", () => {
    const result = parseImportedText('"hello"');
    expect(result.error).toBeUndefined();
    expect(result.parsed).toBe("hello");
    expect(result.label).toContain("string");
  });

  it("parses NDJSON when JSON fails", () => {
    const result = parseImportedText('{"a":1}\n{"b":2}');
    expect(result.error).toBeUndefined();
    expect(result.parsed).toEqual([{ a: 1 }, { b: 2 }]);
    expect(result.label).toContain("NDJSON");
  });

  it("returns error for empty input", () => {
    const result = parseImportedText("");
    expect(result.error).toBe("Empty input");
    expect(result.parsed).toBeNull();
  });

  it("returns error for invalid input", () => {
    const result = parseImportedText("not json at all");
    expect(result.error).toBeDefined();
    expect(result.parsed).toBeNull();
  });

  it("trims whitespace before parsing", () => {
    const result = parseImportedText('  {"a": 1}  ');
    expect(result.error).toBeUndefined();
    expect(result.parsed).toEqual({ a: 1 });
  });
});
