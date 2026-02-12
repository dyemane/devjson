import { describe, it, expect } from "vitest";
import { diffJson, summarizeDiff } from "./json-diff";

describe("diffJson", () => {
  it("detects unchanged primitives", () => {
    const result = diffJson(42, 42);
    expect(result).toEqual([
      { path: "", key: "$", type: "unchanged", depth: 0, oldValue: 42, newValue: 42 },
    ]);
  });

  it("detects changed primitives", () => {
    const result = diffJson("hello", "world");
    expect(result).toEqual([
      { path: "", key: "$", type: "changed", depth: 0, oldValue: "hello", newValue: "world" },
    ]);
  });

  it("detects added object keys", () => {
    const result = diffJson({ a: 1 }, { a: 1, b: 2 });
    expect(result).toHaveLength(2);
    const added = result.find((e) => e.type === "added");
    expect(added).toMatchObject({ key: "b", type: "added", newValue: 2 });
  });

  it("detects removed object keys", () => {
    const result = diffJson({ a: 1, b: 2 }, { a: 1 });
    const removed = result.find((e) => e.type === "removed");
    expect(removed).toMatchObject({ key: "b", type: "removed", oldValue: 2 });
  });

  it("detects changed object values", () => {
    const result = diffJson({ a: 1 }, { a: 2 });
    expect(result).toEqual([
      { path: "a", key: "a", type: "changed", depth: 1, oldValue: 1, newValue: 2 },
    ]);
  });

  it("handles nested objects", () => {
    const result = diffJson({ a: { b: 1 } }, { a: { b: 2 } });
    expect(result).toEqual([
      { path: "a.b", key: "b", type: "changed", depth: 2, oldValue: 1, newValue: 2 },
    ]);
  });

  it("handles arrays with added elements", () => {
    const result = diffJson([1, 2], [1, 2, 3]);
    const added = result.find((e) => e.type === "added");
    expect(added).toMatchObject({ key: "2", type: "added", newValue: 3 });
  });

  it("handles arrays with removed elements", () => {
    const result = diffJson([1, 2, 3], [1, 2]);
    const removed = result.find((e) => e.type === "removed");
    expect(removed).toMatchObject({ key: "2", type: "removed", oldValue: 3 });
  });

  it("detects type mismatch (object vs primitive)", () => {
    const result = diffJson({ a: 1 }, "hello");
    expect(result).toEqual([
      { path: "", key: "$", type: "changed", depth: 0, oldValue: { a: 1 }, newValue: "hello" },
    ]);
  });

  it("detects type mismatch (array vs object)", () => {
    const result = diffJson([1, 2], { a: 1 });
    expect(result).toEqual([
      { path: "", key: "$", type: "changed", depth: 0, oldValue: [1, 2], newValue: { a: 1 } },
    ]);
  });

  it("handles null values", () => {
    const result = diffJson(null, "hello");
    expect(result).toEqual([
      { path: "", key: "$", type: "changed", depth: 0, oldValue: null, newValue: "hello" },
    ]);
  });

  it("handles identical objects", () => {
    const obj = { a: 1, b: "two", c: [3] };
    const result = diffJson(obj, { ...obj, c: [3] });
    const types = result.map((e) => e.type);
    expect(types.every((t) => t === "unchanged")).toBe(true);
  });
});

describe("summarizeDiff", () => {
  it("counts diff types correctly", () => {
    const result = diffJson(
      { a: 1, b: 2, c: 3 },
      { a: 1, b: 99, d: 4 },
    );
    const summary = summarizeDiff(result);
    expect(summary).toEqual({ added: 1, removed: 1, changed: 1 });
  });

  it("returns zeros for identical inputs", () => {
    const result = diffJson({ a: 1 }, { a: 1 });
    const summary = summarizeDiff(result);
    expect(summary).toEqual({ added: 0, removed: 0, changed: 0 });
  });
});
