import { z } from "zod";

export const CarbonCategorySchema = z.enum(["transport", "food", "energy", "waste"]);

export const CarbonEntrySchema = z.object({
  id: z.string().uuid(),
  category: CarbonCategorySchema,
  value: z.number().nonnegative("Value must be a non-negative number"),
  description: z.string().max(100, "Description must be 100 characters or fewer").trim(),
  date: z.string().datetime("Date must be a valid ISO 8601 datetime string"),
  carbonValue: z.number().nonnegative("Carbon value must be a non-negative number")
});

export const CarbonTargetSchema = z.object({
  targetValue: z.number().positive("Target value must be a positive number"),
  category: z.enum(["total", "transport", "food", "energy", "waste"]),
  interval: z.enum(["weekly", "monthly", "yearly"])
});

export const UserSettingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  language: z.enum(["en", "es", "fr"]),
  onboardingCompleted: z.boolean()
});

export const InsightSchema = z.object({
  id: z.string().uuid(),
  title: z.string().max(100, "Title must be 100 characters or fewer"),
  message: z.string().max(300, "Message must be 300 characters or fewer"),
  impactLevel: z.enum(["low", "medium", "high"]),
  actionText: z.string().max(50, "Action text must be 50 characters or fewer")
});

export const GoalSchema = z.object({
  id: z.string().uuid(),
  title: z.string().max(100),
  category: CarbonCategorySchema.or(z.literal("total")),
  targetValue: z.number().positive(),
  progress: z.number().min(0).max(100),
  active: z.boolean(),
  createdAt: z.string().datetime()
});

export const ChallengeSchema = z.object({
  id: z.string().uuid(),
  title: z.string().max(100),
  description: z.string().max(300),
  durationDays: z.number().int().positive(),
  completed: z.boolean(),
  createdAt: z.string().datetime()
});

export const StorageEnvelopeSchema = z.object({
  version: z.number().int().positive("Version must be a positive integer"),
  payload: z.unknown()
});
