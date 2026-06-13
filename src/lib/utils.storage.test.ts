import { describe, it, expect, beforeEach, vi } from "vitest";
import { safeJsonParse, stripDangerousKeys, safeStorageParser, saveToStorage, STORAGE_VERSION, generateUuid } from "./utils";
import { z } from "zod";

describe("utils storage and safety helpers", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Ensure clean localStorage
    window.localStorage.clear();
  });

  it("safeJsonParse returns null for invalid JSON and parses valid JSON", () => {
    expect(safeJsonParse("not-json")).toBeNull();
    expect(safeJsonParse(JSON.stringify({ a: 1 }))).toEqual({ a: 1 });
  });

  it("stripDangerousKeys removes prototype pollution vectors", () => {
    const polluted: Record<string, unknown> = { good: 1, __proto__: { polluted: true }, nested: { constructor: { evil: true }, ok: 2 } };
    const cleaned = stripDangerousKeys(polluted) as Record<string, unknown>;
    expect(cleaned.good).toBe(1);
    // Ensure prototype pollution did not inject properties onto the prototype
    expect((cleaned as Record<string, unknown>).polluted).toBeUndefined();
    expect(Object.prototype.hasOwnProperty.call(cleaned.nested, "constructor")).toBe(false);
    const nestedCleaned = cleaned.nested as Record<string, unknown>;
    expect(nestedCleaned.ok).toBe(2);
  });

  it("safeStorageParser recovers from corrupted JSON and writes default back", () => {
    const key = "test_key";
    window.localStorage.setItem(key, "not-a-json");

    const schema = z.array(z.number());
    const res = safeStorageParser(key, schema, [1, 2, 3]);

    expect(res).toEqual([1, 2, 3]);
    const written = JSON.parse(String(window.localStorage.getItem(key))) as Record<string, unknown>;
    expect(written.version).toBe(STORAGE_VERSION);
    expect(Array.isArray(written.payload)).toBe(true);
  });

  it("safeStorageParser handles version mismatch by resetting to default", () => {
    const key = "version_key";
    const envelope = { version: STORAGE_VERSION + 1, payload: [1, 2, 3] };
    window.localStorage.setItem(key, JSON.stringify(envelope));

    const schema = z.array(z.number());
    const res = safeStorageParser(key, schema, [9]);

    expect(res).toEqual([9]);
    const written = JSON.parse(String(window.localStorage.getItem(key))) as Record<string, unknown>;
    expect(written.version).toBe(STORAGE_VERSION);
  });

  it("saveToStorage swallows storage exceptions", () => {
    const key = "quota_test";
    const original = window.localStorage.setItem;
    window.localStorage.setItem = ((): never => { throw new Error("quota"); }) as (key: string, value: string) => void;
    expect(() => saveToStorage(key, { a: 1 })).not.toThrow();
    // restore
    window.localStorage.setItem = original;
  });

  it("generateUuid returns a string and is unique-ish", () => {
    const a = generateUuid();
    const b = generateUuid();
    expect(typeof a).toBe("string");
    expect(a).not.toBe(b);
  });
});
