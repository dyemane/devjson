import { describe, it, expect } from "vitest";
import { tryParseNdjson, isNdjsonMime } from "./ndjson";

describe("tryParseNdjson", () => {
  it("parses multiple JSON lines into an array", () => {
    const body = '{"a":1}\n{"b":2}\n{"c":3}';
    const result = tryParseNdjson(body);
    expect(result.error).toBeNull();
    expect(result.parsed).toEqual([{ a: 1 }, { b: 2 }, { c: 3 }]);
  });

  it("ignores empty lines", () => {
    const body = '{"a":1}\n\n{"b":2}\n';
    const result = tryParseNdjson(body);
    expect(result.error).toBeNull();
    expect(result.parsed).toEqual([{ a: 1 }, { b: 2 }]);
  });

  it("returns error for single line (not NDJSON)", () => {
    const result = tryParseNdjson('{"a":1}');
    expect(result.parsed).toBeNull();
    expect(result.error).toContain("Not valid");
  });

  it("returns error with line number for invalid line", () => {
    const body = '{"a":1}\nnot json\n{"c":3}';
    const result = tryParseNdjson(body);
    expect(result.parsed).toBeNull();
    expect(result.error).toBe("NDJSON parse error on line 2");
  });

  it("handles mixed types across lines", () => {
    const body = '{"a":1}\n[1,2,3]\n"hello"\n42';
    const result = tryParseNdjson(body);
    expect(result.error).toBeNull();
    expect(result.parsed).toEqual([{ a: 1 }, [1, 2, 3], "hello", 42]);
  });
});

describe("isNdjsonMime", () => {
  it("recognizes application/x-ndjson", () => {
    expect(isNdjsonMime("application/x-ndjson")).toBe(true);
  });

  it("recognizes application/jsonl", () => {
    expect(isNdjsonMime("application/jsonl")).toBe(true);
  });

  it("recognizes application/x-jsonlines", () => {
    expect(isNdjsonMime("application/x-jsonlines")).toBe(true);
  });

  it("handles charset suffix", () => {
    expect(isNdjsonMime("application/x-ndjson; charset=utf-8")).toBe(true);
  });

  it("rejects regular JSON mime", () => {
    expect(isNdjsonMime("application/json")).toBe(false);
  });
});
