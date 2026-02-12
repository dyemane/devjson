import { describe, expect, it } from "vitest";
import { jsonPointerToInternalPath } from "./use-jsonpath";

describe("jsonPointerToInternalPath", () => {
  it("converts empty pointer to empty string (root)", () => {
    expect(jsonPointerToInternalPath("")).toBe("");
  });

  it("converts root slash to empty string", () => {
    expect(jsonPointerToInternalPath("/")).toBe("");
  });

  it("converts simple object path", () => {
    expect(jsonPointerToInternalPath("/store/name")).toBe("store.name");
  });

  it("converts array indices to bracket notation", () => {
    expect(jsonPointerToInternalPath("/store/book/0/author")).toBe(
      "store.book[0].author",
    );
  });

  it("handles root-level array index", () => {
    expect(jsonPointerToInternalPath("/0/name")).toBe("[0].name");
  });

  it("handles consecutive array indices", () => {
    expect(jsonPointerToInternalPath("/data/0/1/2")).toBe("data[0][1][2]");
  });

  it("unescapes JSON Pointer ~1 to /", () => {
    expect(jsonPointerToInternalPath("/a~1b")).toBe("a/b");
  });

  it("unescapes JSON Pointer ~0 to ~", () => {
    expect(jsonPointerToInternalPath("/m~0n")).toBe("m~n");
  });

  it("handles mixed nesting with escapes", () => {
    expect(jsonPointerToInternalPath("/data/0/key~1name")).toBe(
      "data[0].key/name",
    );
  });
});
