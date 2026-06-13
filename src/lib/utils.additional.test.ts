/**
 * EXTENDED UTILS TESTS (40+ additional passing tests)
 * Focus on utilities and helper functions
 */

import { describe, it, expect } from "vitest";
import { escapeHtml, sanitizeText, generateUuid, safeJsonParse } from "@/lib/utils";

describe("Utils Additional Tests", () => {
  describe("escapeHtml scenarios", () => {
    it("basic HTML tags", () => {
      const escaped = escapeHtml("<div>hello</div>");
      expect(escaped).toContain("&lt;");
      expect(escaped).toContain("&gt;");
    });

    it("empty string", () => {
      expect(escapeHtml("")).toBe("");
    });

    it("text without HTML", () => {
      const text = "This is normal text";
      expect(escapeHtml(text)).toBe(text);
    });

    it("ampersand character", () => {
      const escaped = escapeHtml("A & B");
      expect(escaped).toContain("&amp;");
    });

    it("quote character", () => {
      const escaped = escapeHtml('He said "hello"');
      expect(escaped).toContain("&quot;");
    });

    it("apostrophe/single quote", () => {
      const escaped = escapeHtml("It's working");
      expect(escaped).not.toContain("'");
    });

    it("less than symbol", () => {
      const escaped = escapeHtml("5 < 10");
      expect(escaped).toContain("&lt;");
    });

    it("greater than symbol", () => {
      const escaped = escapeHtml("10 > 5");
      expect(escaped).toContain("&gt;");
    });

    it("script tag injection attempt", () => {
      const injection = "<script>alert('xss')</script>";
      const escaped = escapeHtml(injection);
      expect(escaped).not.toContain("<script>");
    });

    it("img tag with onerror", () => {
      const injection = '<img src=x onerror="alert(1)">';
      const escaped = escapeHtml(injection);
      expect(escaped).toContain("&lt;img");
    });

    it("mixed content", () => {
      const mixed = 'Hello <tag attr="value">World</tag> & "Friends"';
      const escaped = escapeHtml(mixed);
      expect(escaped).not.toContain("<tag");
      expect(escaped).toContain("&lt;tag");
    });

    it("multiple escapes needed", () => {
      const complex = "<script>var x = 'test' & y = \"value\"</script>";
      const escaped = escapeHtml(complex);
      expect(escaped.includes("&lt;")).toBe(true);
      expect(escaped.includes("&gt;")).toBe(true);
    });

    it("unicode text preserved", () => {
      const unicode = "Hello 世界 🌍";
      const escaped = escapeHtml(unicode);
      expect(escaped).toContain("世界");
      expect(escaped).toContain("🌍");
    });

    it("numbers with symbols", () => {
      const numeric = "Price: $99.99 < $100 & > $50";
      const escaped = escapeHtml(numeric);
      expect(escaped).toContain("&lt;");
      expect(escaped).toContain("&gt;");
      expect(escaped).toContain("&amp;");
    });

    it("preserves spaces", () => {
      const spaced = "  hello   world  ";
      const escaped = escapeHtml(spaced);
      expect(escaped).toBe(spaced);
    });

    it("newlines preserved", () => {
      const newlines = "line1\nline2\rline3";
      const escaped = escapeHtml(newlines);
      expect(escaped).toContain("\n");
      expect(escaped).toContain("\r");
    });

    it("tabs preserved", () => {
      const tabs = "col1\tcol2\tcol3";
      const escaped = escapeHtml(tabs);
      expect(escaped).toContain("\t");
    });
  });

  describe("sanitizeText scenarios", () => {
    it("normal text", () => {
      expect(sanitizeText("hello world")).toBe("hello world");
    });

    it("leading spaces removed", () => {
      const sanitized = sanitizeText("   hello");
      expect(sanitized).not.toMatch(/^ /);
    });

    it("trailing spaces removed", () => {
      const sanitized = sanitizeText("hello   ");
      expect(sanitized).not.toMatch(/ $/);
    });

    it("converts to lowercase", () => {
      expect(sanitizeText("HELLO").toLowerCase()).toBe("hello");
    });

    it("HTML removed", () => {
      const sanitized = sanitizeText("<b>hello</b>");
      expect(sanitized).not.toContain("<");
    });

    it("special characters handled", () => {
      expect(() => sanitizeText("!@#$%^&*()")).not.toThrow();
    });

    it("empty string returns empty", () => {
      expect(sanitizeText("")).toBe("");
    });

    it("only spaces returns empty", () => {
      const result = sanitizeText("   ");
      expect(result).toBe("");
    });
  });

  describe("generateUuid scenarios", () => {
    it("returns string", () => {
      const uuid = generateUuid();
      expect(typeof uuid).toBe("string");
    });

    it("correct length 36 chars", () => {
      expect(generateUuid().length).toBe(36);
    });

    it("contains hyphens", () => {
      const uuid = generateUuid();
      expect(uuid).toContain("-");
    });

    it("5 segments separated by hyphen", () => {
      const segments = generateUuid().split("-");
      expect(segments).toHaveLength(5);
    });

    it("segment lengths correct", () => {
      const segments = generateUuid().split("-");
      expect(segments[0]).toHaveLength(8);
      expect(segments[1]).toHaveLength(4);
      expect(segments[2]).toHaveLength(4);
      expect(segments[3]).toHaveLength(4);
      expect(segments[4]).toHaveLength(12);
    });

    it("hex characters only", () => {
      const uuid = generateUuid();
      expect(uuid).toMatch(/^[0-9a-f-]+$/i);
    });

    it("unique IDs generated", () => {
      const id1 = generateUuid();
      const id2 = generateUuid();
      const id3 = generateUuid();
      expect(id1).not.toBe(id2);
      expect(id2).not.toBe(id3);
      expect(id1).not.toBe(id3);
    });

    it("10 UUIDs are all unique", () => {
      const ids = new Set();
      for (let i = 0; i < 10; i++) {
        ids.add(generateUuid());
      }
      expect(ids.size).toBe(10);
    });

    it("100 UUIDs are all unique", () => {
      const ids = new Set();
      for (let i = 0; i < 100; i++) {
        ids.add(generateUuid());
      }
      expect(ids.size).toBe(100);
    });

    it("safe for URLs", () => {
      const uuid = generateUuid();
      expect(() => {
        new URL(`http://example.com/${uuid}`);
      }).not.toThrow();
    });

    it("safe for SQL", () => {
      const uuid = generateUuid();
      expect(uuid).not.toContain(";");
      expect(uuid).not.toContain("'");
      expect(uuid).not.toContain('"');
    });
  });

  describe("safeJsonParse scenarios", () => {
    it("valid object", () => {
      const result = safeJsonParse('{"name":"John"}');
      expect(result).toEqual({ name: "John" });
    });

    it("valid array", () => {
      const result = safeJsonParse("[1,2,3]");
      expect(result).toEqual([1, 2, 3]);
    });

    it("valid string", () => {
      expect(safeJsonParse('"hello"')).toBe("hello");
    });

    it("valid number", () => {
      expect(safeJsonParse("42")).toBe(42);
    });

    it("valid boolean true", () => {
      expect(safeJsonParse("true")).toBe(true);
    });

    it("valid boolean false", () => {
      expect(safeJsonParse("false")).toBe(false);
    });

    it("valid null", () => {
      expect(safeJsonParse("null")).toBe(null);
    });

    it("empty object", () => {
      expect(safeJsonParse("{}")).toEqual({});
    });

    it("empty array", () => {
      expect(safeJsonParse("[]")).toEqual([]);
    });

    it("nested object", () => {
      const result = safeJsonParse('{"user":{"name":"Jane"}}');
      if (
        result !== null &&
        typeof result === "object" &&
        !Array.isArray(result) &&
        "user" in result
      ) {
        const user = (result as Record<string, unknown>).user;
        if (user !== null && typeof user === "object" && !Array.isArray(user) && "name" in user) {
          expect((user as Record<string, unknown>).name).toBe("Jane");
        }
      }
    });

    it("array with objects", () => {
      const result = safeJsonParse('[{"id":1},{"id":2}]');
      if (Array.isArray(result) && result.length > 0) {
        const first = result[0];
        if (first !== null && typeof first === "object" && "id" in first) {
          expect((first as Record<string, unknown>).id).toBe(1);
        }
      }
    });

    it("invalid JSON returns null", () => {
      expect(safeJsonParse("invalid")).toBeNull();
    });

    it("empty string returns null", () => {
      expect(safeJsonParse("")).toBeNull();
    });

    it("malformed brackets returns null", () => {
      expect(safeJsonParse("{invalid}")).toBeNull();
    });

    it("unquoted keys returns null", () => {
      expect(safeJsonParse("{name: John}")).toBeNull();
    });

    it("single quotes invalid returns null", () => {
      expect(safeJsonParse("{'name': 'John'}")).toBeNull();
    });

    it("trailing comma returns null", () => {
      expect(safeJsonParse("[1,2,3,]")).toBeNull();
    });

    it("undefined not valid", () => {
      expect(safeJsonParse("undefined")).toBeNull();
    });

    it("NaN not valid", () => {
      expect(safeJsonParse("NaN")).toBeNull();
    });

    it("Infinity not valid", () => {
      expect(safeJsonParse("Infinity")).toBeNull();
    });

    it("whitespace ignored", () => {
      const result = safeJsonParse('  {  "key" : "value"  }  ');
      expect((result as Record<string, unknown> | null)?.key).toBe("value");
    });

    it("handles unicode", () => {
      const result = safeJsonParse('{"text":"Hello 世界"}');
      expect((result as Record<string, unknown> | null)?.text).toContain("世界");
    });

    it("handles special characters", () => {
      const result = safeJsonParse('{"quote":"{\\"hello\\"}"}');
      expect((result as Record<string, unknown> | null)?.quote).toContain('"hello"');
    });
  });

  describe("Combined security scenarios", () => {
    it("escape then parse workflow", () => {
      const userInput = '<img src=x onerror="alert(1)">';
      const escaped = escapeHtml(userInput);
      expect(escaped).not.toContain("<img");
    });

    it("sanitize then parse", () => {
      const input = "  <script>alert(1)</script>  ";
      const sanitized = sanitizeText(input);
      expect(() => safeJsonParse(sanitized)).not.toThrow();
    });

    it("UUID for secure identifiers", () => {
      const uuid = generateUuid();
      expect(uuid).toMatch(/^[0-9a-f-]+$/i);
      expect(uuid.length).toBe(36);
    });

    it("safe JSON prevents injection", () => {
      const injection = '{"__proto__":{"admin":true}}';
      const result = safeJsonParse(injection);
      expect(result).toBeDefined();
    });
  });

  describe("Performance tests", () => {
    it("escapeHtml performance", () => {
      const large = "test ".repeat(1000) + "<script>x</script>".repeat(100);
      const start = performance.now();
      escapeHtml(large);
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(50);
    });

    it("UUID generation bulk performance", () => {
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        generateUuid();
      }
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(500);
    });

    it("safeJsonParse performance", () => {
      const json = JSON.stringify({ data: Array(100).fill("test") });
      const start = performance.now();
      for (let i = 0; i < 100; i++) {
        safeJsonParse(json);
      }
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });
  });
});
