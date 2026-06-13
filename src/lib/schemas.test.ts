import { describe, it, expect } from "vitest";
import {
  CarbonCategorySchema,
  CarbonEntrySchema,
  CarbonTargetSchema,
  UserSettingsSchema,
  InsightSchema,
  StorageEnvelopeSchema
} from "./schemas";

describe("Validation Schemas", () => {
  describe("CarbonCategorySchema", () => {
    it("accepts valid categories", () => {
      expect(CarbonCategorySchema.safeParse("transport").success).toBe(true);
      expect(CarbonCategorySchema.safeParse("food").success).toBe(true);
      expect(CarbonCategorySchema.safeParse("energy").success).toBe(true);
      expect(CarbonCategorySchema.safeParse("waste").success).toBe(true);
    });

    it("rejects invalid categories", () => {
      expect(CarbonCategorySchema.safeParse("airplane").success).toBe(false);
      expect(CarbonCategorySchema.safeParse(123).success).toBe(false);
    });
  });

  describe("CarbonEntrySchema", () => {
    const validEntry = {
      id: "a2e11ef6-750a-4f83-94a4-871f8a40dc44",
      category: "food",
      value: 15.5,
      description: "Organic dinner",
      date: "2026-06-10T20:30:44.000Z",
      carbonValue: 4.2
    };

    it("accepts valid entries", () => {
      expect(CarbonEntrySchema.safeParse(validEntry).success).toBe(true);
    });

    it("rejects negative values and carbonValues", () => {
      expect(CarbonEntrySchema.safeParse({ ...validEntry, value: -1 }).success).toBe(false);
      expect(CarbonEntrySchema.safeParse({ ...validEntry, carbonValue: -0.5 }).success).toBe(false);
    });

    it("rejects invalid UUIDs and Dates", () => {
      expect(CarbonEntrySchema.safeParse({ ...validEntry, id: "invalid-uuid" }).success).toBe(false);
      expect(CarbonEntrySchema.safeParse({ ...validEntry, date: "not-a-date" }).success).toBe(false);
    });

    it("rejects descriptions that exceed 100 characters", () => {
      expect(
        CarbonEntrySchema.safeParse({ ...validEntry, description: "a".repeat(101) }).success
      ).toBe(false);
    });
  });

  describe("CarbonTargetSchema", () => {
    const validTarget = {
      targetValue: 250,
      category: "total",
      interval: "weekly"
    };

    it("accepts valid targets", () => {
      expect(CarbonTargetSchema.safeParse(validTarget).success).toBe(true);
    });

    it("rejects non-positive targets", () => {
      expect(CarbonTargetSchema.safeParse({ ...validTarget, targetValue: 0 }).success).toBe(false);
      expect(CarbonTargetSchema.safeParse({ ...validTarget, targetValue: -10 }).success).toBe(false);
    });
  });

  describe("UserSettingsSchema", () => {
    const validSettings = {
      theme: "dark",
      language: "en",
      onboardingCompleted: true
    };

    it("accepts valid settings", () => {
      expect(UserSettingsSchema.safeParse(validSettings).success).toBe(true);
    });

    it("rejects invalid options", () => {
      expect(UserSettingsSchema.safeParse({ ...validSettings, theme: "blue" }).success).toBe(false);
      expect(UserSettingsSchema.safeParse({ ...validSettings, language: "de" }).success).toBe(false);
    });
  });

  describe("InsightSchema", () => {
    const validInsight = {
      id: "a2e11ef6-750a-4f83-94a4-871f8a40dc44",
      title: "Conserve Electricity",
      message: "Switching off devices can save up to 10kg of CO2.",
      impactLevel: "medium",
      actionText: "Learn How"
    };

    it("accepts valid insights", () => {
      expect(InsightSchema.safeParse(validInsight).success).toBe(true);
    });

    it("rejects strings exceeding lengths", () => {
      expect(InsightSchema.safeParse({ ...validInsight, title: "a".repeat(101) }).success).toBe(
        false
      );
      expect(InsightSchema.safeParse({ ...validInsight, message: "a".repeat(301) }).success).toBe(
        false
      );
      expect(InsightSchema.safeParse({ ...validInsight, actionText: "a".repeat(51) }).success).toBe(
        false
      );
    });
  });

  describe("StorageEnvelopeSchema", () => {
    const validEnvelope = {
      version: 1,
      payload: { data: "test" }
    };

    it("accepts valid envelopes", () => {
      expect(StorageEnvelopeSchema.safeParse(validEnvelope).success).toBe(true);
    });

    it("rejects non-integer versions", () => {
      expect(StorageEnvelopeSchema.safeParse({ ...validEnvelope, version: 1.5 }).success).toBe(
        false
      );
      expect(StorageEnvelopeSchema.safeParse({ ...validEnvelope, version: -2 }).success).toBe(
        false
      );
    });
  });
});
