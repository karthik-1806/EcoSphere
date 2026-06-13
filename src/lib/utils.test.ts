import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  cn,
  escapeHtml,
  sanitizeText,
  stripDangerousKeys,
  safeJsonParse,
  safeStorageParser,
  saveToStorage,
  generateUuid,
  STORAGE_VERSION
} from "./utils";
import { axe } from "vitest-axe";
import { z } from "zod";
describe("Utility Suite", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  describe("cn (Tailwind Merging)", () => {
    it("should merge classes and override appropriately", () => {
      expect(cn("px-2 py-2", "p-4")).toBe("p-4");
      expect(cn("bg-red-500", "bg-emerald-500 text-white")).toBe("bg-emerald-500 text-white");
    });
  });

  describe("escapeHtml & sanitizeText", () => {
    const xssPayload = `<script>alert("hack");</script> <img src="x" onerror="alert(1)"> & '" /`;

    it("should escape all active HTML characters", () => {
      const escaped = escapeHtml(xssPayload);
      expect(escaped).not.toContain("<");
      expect(escaped).not.toContain(">");
      expect(escaped).not.toContain('"');
      expect(escaped).not.toContain("'");
      expect(escaped).not.toContain("/");
      expect(escaped).toContain("&lt;script&gt;");
      expect(escaped).toContain("&#x2F;script&gt;");
      expect(escaped).toContain("&#x27;");
      expect(escaped).toContain("&#x2F;");
    });

    it("should trim and escape text under sanitizeText", () => {
      const dirty = "   <svg>   ";
      expect(sanitizeText(dirty)).toBe("&lt;svg&gt;");
    });
  });

  describe("Prototype Pollution Prevention (stripDangerousKeys & safeJsonParse)", () => {
    it("should strip dangerous keys from objects", () => {
      const maliciousPayload = JSON.parse(
        '{"name": "EcoSphere", "__proto__": {"polluted": true}, "constructor": {"prototype": {"polluted": true}}}'
      );
      const cleaned = stripDangerousKeys(maliciousPayload) as Record<string, unknown>;

      expect(cleaned.name).toBe("EcoSphere");
      expect(Object.prototype.hasOwnProperty.call(cleaned, "__proto__")).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(cleaned, "constructor")).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(cleaned, "prototype")).toBe(false);
      expect(Object.getPrototypeOf(cleaned)).toBe(Object.prototype);
      expect((cleaned as Record<string, unknown>)["polluted"]).toBeUndefined();
      expect(({} as Record<string, unknown>)["polluted"]).toBeUndefined();
    });

    it("should recursively clean nested objects and arrays", () => {
      const nested = {
        users: [{ name: "Alice", prototype: "malicious" }],
        metadata: {
          __proto__: { bad: true },
          created: "2026-06"
        }
      };

      const cleaned = stripDangerousKeys(nested) as {
        users: { name: string }[];
        metadata: { created: string };
      };
      const firstUser = cleaned.users[0];
      expect(firstUser).toBeDefined();
      expect(firstUser?.name).toBe("Alice");
      if (firstUser) {
        expect(Object.prototype.hasOwnProperty.call(firstUser, "prototype")).toBe(false);
      }
      expect(Object.prototype.hasOwnProperty.call(cleaned.metadata, "__proto__")).toBe(false);
      expect(cleaned.metadata.created).toBe("2026-06");
      expect(({} as Record<string, unknown>)["bad"]).toBeUndefined();
    });

    it("should return null for malformed JSON strings in safeJsonParse", () => {
      expect(safeJsonParse("{invalid json}")).toBeNull();
    });

    it("should return parsed and cleaned object for valid JSON", () => {
      const parsed = safeJsonParse('{"app": "Eco", "__proto__": {"polluted": true}}') as Record<
        string,
        unknown
      >;
      expect(parsed["app"]).toBe("Eco");
      expect(Object.prototype.hasOwnProperty.call(parsed, "__proto__")).toBe(false);
      expect(parsed["polluted"]).toBeUndefined();
      expect(({} as Record<string, unknown>)["polluted"]).toBeUndefined();
    });

    it("should pass through primitive types", () => {
      expect(stripDangerousKeys("string")).toBe("string");
      expect(stripDangerousKeys(123)).toBe(123);
      expect(stripDangerousKeys(null)).toBeNull();
    });
  });

  describe("safeStorageParser & saveToStorage (Corrupted Recovery & Versioning)", () => {
    const TestSchema = z.object({
      username: z.string(),
      count: z.number().int()
    });
    const defaultData = { username: "Guest", count: 0 };
    const validData = { username: "Alice", count: 42 };

    it("returns default value when localStorage is undefined", () => {
      const localStorageSpy = vi
        .spyOn(window, "localStorage", "get")
        .mockReturnValue(undefined as unknown as Storage);
      expect(safeStorageParser("test-key", TestSchema, defaultData)).toEqual(defaultData);
      localStorageSpy.mockRestore();
    });

    it("returns default value if storage key is empty", () => {
      expect(safeStorageParser("empty-key", TestSchema, defaultData)).toEqual(defaultData);
    });

    it("returns default value and resets storage if JSON is corrupted", () => {
      window.localStorage.setItem("corrupt-key", "invalid { json");
      const result = safeStorageParser("corrupt-key", TestSchema, defaultData);
      expect(result).toEqual(defaultData);

      const rawStored = window.localStorage.getItem("corrupt-key");
      expect(rawStored).not.toBeNull();
      const stored = JSON.parse(rawStored as string);
      expect(stored.payload).toEqual(defaultData);
      expect(stored.version).toBe(STORAGE_VERSION);
    });

    it("recovers if envelope is invalid", () => {
      window.localStorage.setItem("no-envelope", JSON.stringify({ name: "no-version-here" }));
      const result = safeStorageParser("no-envelope", TestSchema, defaultData);
      expect(result).toEqual(defaultData);
    });

    it("recovers if version mismatches", () => {
      const oldEnvelope = { version: STORAGE_VERSION + 10, payload: validData };
      window.localStorage.setItem("version-key", JSON.stringify(oldEnvelope));
      const result = safeStorageParser("version-key", TestSchema, defaultData);
      expect(result).toEqual(defaultData);
    });

    it("recovers if payload validation fails", () => {
      const badEnvelope = {
        version: STORAGE_VERSION,
        payload: { username: 123, count: "not-int" }
      };
      window.localStorage.setItem("invalid-payload", JSON.stringify(badEnvelope));
      const result = safeStorageParser("invalid-payload", TestSchema, defaultData);
      expect(result).toEqual(defaultData);
    });

    it("returns valid payload if envelope, version, and schema match", () => {
      saveToStorage("valid-key", validData);
      const result = safeStorageParser("valid-key", TestSchema, defaultData);
      expect(result).toEqual(validData);
    });

    it("handles saveToStorage when localStorage is undefined", () => {
      const localStorageSpy = vi
        .spyOn(window, "localStorage", "get")
        .mockReturnValue(undefined as unknown as Storage);
      expect(() => saveToStorage("test-key", validData)).not.toThrow();
      localStorageSpy.mockRestore();
    });

    it("handles localStorage quota exceeded cleanly in saveToStorage", () => {
      const setItemMock = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("QuotaExceededError");
      });
      // Should not throw, fails silently/handles it
      expect(() => saveToStorage("test-key", validData)).not.toThrow();
      expect(setItemMock).toHaveBeenCalled();
      setItemMock.mockRestore();
    });

    it("generates a valid UUID fallback when crypto.randomUUID is unavailable", () => {
      const originalCrypto = globalThis.crypto;
      const fakeCrypto = {
        getRandomValues: (arr: Uint8Array) => {
          for (let i = 0; i < arr.length; i += 1) arr[i] = i + 1;
          return arr;
        }
      } as unknown as Crypto;
      vi.stubGlobal("crypto", fakeCrypto);

      const id = generateUuid();
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

      vi.stubGlobal("crypto", originalCrypto as Crypto);
    });
  });

  describe("Accessibility Test Framework validation", () => {
    it("satisfies axe check for simple elements", async () => {
      const div = document.createElement("div");
      div.innerHTML = `<main><h1>EcoSphere</h1><button aria-label="Confirm">Click</button></main>`;
      const res = await axe(div);
      expect(res).toHaveNoViolations();
    });
  });
});
