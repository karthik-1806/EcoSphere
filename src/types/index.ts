import { z } from "zod";
import {
  CarbonCategorySchema,
  CarbonEntrySchema,
  CarbonTargetSchema,
  UserSettingsSchema,
  InsightSchema,
  StorageEnvelopeSchema
} from "@/lib/schemas";

export type CarbonCategory = z.infer<typeof CarbonCategorySchema>;
export type CarbonEntry = Readonly<z.infer<typeof CarbonEntrySchema>>;
export type CarbonTarget = Readonly<z.infer<typeof CarbonTargetSchema>>;
export type UserSettings = Readonly<z.infer<typeof UserSettingsSchema>>;
export type Insight = Readonly<z.infer<typeof InsightSchema>>;
export type StorageEnvelope = Readonly<z.infer<typeof StorageEnvelopeSchema>>;
export type Goal = Readonly<z.infer<typeof import("@/lib/schemas").GoalSchema>>;
export type Challenge = Readonly<z.infer<typeof import("@/lib/schemas").ChallengeSchema>>;
