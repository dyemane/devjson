import { describe, expect, it } from "vitest";
import { searchJson } from "./use-json-search";

describe("searchJson", () => {
  it("returns empty for null input", () => {
    expect(searchJson(null, "test")).toEqual([]);
  });

  it("returns empty for undefined input", () => {
    expect(searchJson(undefined, "test")).toEqual([]);
  });

  it("matches everything for empty query (hook guards against this)", () => {
    // searchJson itself doesn't filter empty queries — the useJsonSearch hook does
    const result = searchJson({ name: "hello" }, "");
    expect(result.length).toBeGreaterThan(0);
  });

  describe("key matching", () => {
    it("matches object keys", () => {
      const result = searchJson({ username: "dino" }, "user");
      expect(result).toContainEqual({
        path: "username",
        key: "username",
        value: "dino",
      });
    });

    it("is case-insensitive for keys", () => {
      const result = searchJson({ UserName: "dino" }, "username");
      expect(result.some((m) => m.key === "UserName")).toBe(true);
    });
  });

  describe("value matching", () => {
    it("matches string values", () => {
      const result = searchJson({ city: "Atlanta" }, "atlanta");
      expect(result).toContainEqual({
        path: "city",
        key: "city",
        value: "Atlanta",
      });
    });

    it("matches number values", () => {
      const result = searchJson({ port: 8080 }, "8080");
      expect(result).toContainEqual({
        path: "port",
        key: "port",
        value: "8080",
      });
    });

    it("matches boolean values", () => {
      const result = searchJson({ enabled: true }, "true");
      expect(result).toContainEqual({
        path: "enabled",
        key: "enabled",
        value: "true",
      });
    });
  });

  describe("nested objects", () => {
    it("searches nested object values", () => {
      const data = { user: { profile: { name: "Dino" } } };
      const result = searchJson(data, "dino");
      expect(result).toContainEqual({
        path: "user.profile.name",
        key: "name",
        value: "Dino",
      });
    });

    it("builds dot-separated paths", () => {
      const data = { a: { b: { c: "found" } } };
      const result = searchJson(data, "found");
      expect(result[0].path).toBe("a.b.c");
    });
  });

  describe("arrays", () => {
    it("matches string items in arrays", () => {
      const data = { tags: ["react", "preact", "vue"] };
      const result = searchJson(data, "preact");
      expect(result).toContainEqual({
        path: "tags[1]",
        key: "1",
        value: "preact",
      });
    });

    it("searches objects inside arrays", () => {
      const data = { users: [{ name: "Alice" }, { name: "Bob" }] };
      const result = searchJson(data, "bob");
      expect(result).toContainEqual({
        path: "users[1].name",
        key: "name",
        value: "Bob",
      });
    });

    it("uses bracket notation for array indices", () => {
      const data = ["hello", "world"];
      const result = searchJson(data, "world");
      expect(result[0].path).toBe("[1]");
    });
  });

  describe("duplicate matches", () => {
    it("matches both key and value when both contain query", () => {
      const data = { name: "username" };
      const result = searchJson(data, "name");
      // "name" matches the key, and "username" matches the value
      expect(result.length).toBe(2);
    });
  });

  describe("real-world payloads", () => {
    it("searches a Clerk-like config", () => {
      const data = {
        auth_config: {
          email_address: "on",
          password: "required",
          single_session_mode: true,
        },
        display_config: {
          application_name: "my-app",
          instance_environment_type: "development",
        },
      };

      const result = searchJson(data, "password");
      expect(result.some((m) => m.key === "password")).toBe(true);

      const envResult = searchJson(data, "development");
      expect(envResult.some((m) => m.value === "development")).toBe(true);
    });

    it("handles deeply nested arrays of objects", () => {
      const data = {
        responses: [
          { items: [{ id: 1, label: "first" }] },
          { items: [{ id: 2, label: "second" }] },
        ],
      };

      const result = searchJson(data, "second");
      expect(result).toContainEqual({
        path: "responses[1].items[0].label",
        key: "label",
        value: "second",
      });
    });
  });
});
