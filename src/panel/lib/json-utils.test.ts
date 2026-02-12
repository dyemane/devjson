import { describe, expect, it } from "vitest";
import {
  formatSize,
  formatJson,
  truncateUrl,
  typeLabel,
  countNodes,
} from "./json-utils";

describe("formatSize", () => {
  it("formats bytes", () => {
    expect(formatSize(0)).toBe("0 B");
    expect(formatSize(512)).toBe("512 B");
    expect(formatSize(1023)).toBe("1023 B");
  });

  it("formats kilobytes", () => {
    expect(formatSize(1024)).toBe("1.0 KB");
    expect(formatSize(1536)).toBe("1.5 KB");
    expect(formatSize(10240)).toBe("10.0 KB");
  });

  it("formats megabytes", () => {
    expect(formatSize(1048576)).toBe("1.0 MB");
    expect(formatSize(2621440)).toBe("2.5 MB");
  });
});

describe("formatJson", () => {
  it("pretty-prints objects", () => {
    expect(formatJson({ a: 1 })).toBe('{\n  "a": 1\n}');
  });

  it("pretty-prints arrays", () => {
    expect(formatJson([1, 2])).toBe("[\n  1,\n  2\n]");
  });

  it("handles primitives", () => {
    expect(formatJson(null)).toBe("null");
    expect(formatJson("hello")).toBe('"hello"');
    expect(formatJson(42)).toBe("42");
  });
});

describe("truncateUrl", () => {
  it("extracts pathname and search from full URL", () => {
    expect(truncateUrl("https://api.example.com/v1/users")).toBe("/v1/users");
  });

  it("truncates long paths with ellipsis", () => {
    const long = "https://api.example.com/" + "a".repeat(100);
    const result = truncateUrl(long, 20);
    expect(result.length).toBe(20);
    expect(result.endsWith("…")).toBe(true);
  });

  it("includes query string", () => {
    expect(truncateUrl("https://api.example.com/users?page=1")).toBe(
      "/users?page=1",
    );
  });

  it("handles non-URL strings gracefully", () => {
    expect(truncateUrl("short")).toBe("short");
    expect(truncateUrl("a".repeat(100), 20).endsWith("…")).toBe(true);
  });

  it("returns path as-is when under max length", () => {
    expect(truncateUrl("https://x.com/api", 60)).toBe("/api");
  });
});

describe("typeLabel", () => {
  it("labels null", () => {
    expect(typeLabel(null)).toBe("null");
  });

  it("labels arrays with length", () => {
    expect(typeLabel([])).toBe("Array(0)");
    expect(typeLabel([1, 2, 3])).toBe("Array(3)");
  });

  it("labels objects with key count", () => {
    expect(typeLabel({})).toBe("Object(0)");
    expect(typeLabel({ a: 1, b: 2 })).toBe("Object(2)");
  });

  it("labels primitives by type", () => {
    expect(typeLabel("hello")).toBe("string");
    expect(typeLabel(42)).toBe("number");
    expect(typeLabel(true)).toBe("boolean");
    expect(typeLabel(undefined)).toBe("undefined");
  });
});

describe("countNodes", () => {
  it("counts primitives as 1", () => {
    expect(countNodes(null)).toBe(1);
    expect(countNodes("hello")).toBe(1);
    expect(countNodes(42)).toBe(1);
    expect(countNodes(true)).toBe(1);
  });

  it("counts flat object nodes", () => {
    // object itself + 2 values
    expect(countNodes({ a: 1, b: 2 })).toBe(3);
  });

  it("counts flat array nodes", () => {
    // array itself + 3 items
    expect(countNodes([1, 2, 3])).toBe(4);
  });

  it("counts nested structures", () => {
    // outer object (1) + inner object (1) + value (1) = 3
    expect(countNodes({ nested: { a: 1 } })).toBe(3);
  });

  it("counts mixed nested structures", () => {
    // outer (1) + array (1) + obj (1) + val (1) + obj (1) + val (1) = 6
    expect(countNodes({ items: [{ id: 1 }, { id: 2 }] })).toBe(6);
  });

  it("counts empty containers", () => {
    expect(countNodes({})).toBe(1);
    expect(countNodes([])).toBe(1);
  });
});
