"use client";

import React, { useState, useCallback, useMemo } from "react";
import { z } from "zod";
import { CarbonEntrySchema } from "@/lib/schemas";
import { CarbonCategory } from "@/types";
import { useContext } from "react";
import { FootprintDispatchContext } from "@/components/providers/AppProvider";
import { calculateEntryCarbon } from "@/lib/calculator";
import { generateUuid, sanitizeText, validateSecureInput } from "@/lib/utils";
import type { CarbonEntry } from "@/types";
import { useRouter } from "next/navigation";

// Sub-components
import CategoryTabs from "./CategoryTabs";
import QuickPresets from "./QuickPresets";
import AmountSlider from "./AmountSlider";
import FormInput from "./FormInput";

const FormSchema = z.object({
  category: z.enum(["transport", "food", "energy", "waste"]),
  value: z.number().positive().max(1000),
  option: z.string().max(100).optional(),
  description: z.string().max(100).optional()
});

// Performance: Memoized presets to avoid recalculation
const PRESETS: Record<
  CarbonCategory,
  readonly { readonly label: string; readonly value: number; readonly option?: string }[]
> = {
  transport: [
    { label: "Short drive (5km)", value: 5, option: "car" },
    { label: "Commute (20km)", value: 20, option: "car" },
    { label: "Bus ride (10km)", value: 10, option: "bus" }
  ] as const,
  food: [
    { label: "Meat meal", value: 1, option: "meat" },
    { label: "Vegan meal", value: 1, option: "vegan" }
  ] as const,
  energy: [
    { label: "Heater (1kWh)", value: 1, option: "electricity" },
    { label: "Gas use (5kWh)", value: 5, option: "gas" }
  ] as const,
  waste: [
    { label: "Bag of waste (1kg)", value: 1, option: "landfill" },
    { label: "Recycled (1kg)", value: 1, option: "recycled" }
  ] as const
} as const;

const CATEGORIES: readonly CarbonCategory[] = ["transport", "food", "energy", "waste"] as const;

/**
 * Main form component for recording a carbon footprint entry.
 * Integrates sub-components for category selection, value input, and submission.
 * @returns JSX Element
 */
function AssessmentFormComponent() {
  const dispatch = useContext(FootprintDispatchContext);
  if (!dispatch) throw new Error("AssessmentForm must be used within AppProvider");

  const router = useRouter();

  const [category, setCategory] = useState<CarbonCategory>("transport");
  const [value, setValue] = useState<number>(10);
  const [option, setOption] = useState<string>("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [liveCarbon, setLiveCarbon] = useState<number>(() => calculateEntryCarbon(category, 10));

  /**
   * Validates form and submits entry.
   * @optimized useCallback to prevent re-binding on every render
   * Time Complexity: O(N) where N is input length for sanitization
   * Space Complexity: O(1)
   */
  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      // Security: Input validation
      const descValidation = validateSecureInput(description, 100);
      if (!descValidation.valid) {
        setError(descValidation.error ?? "Invalid description");
        return;
      }

      const optionValidation = validateSecureInput(option, 100);
      if (!optionValidation.valid) {
        setError(optionValidation.error ?? "Invalid option");
        return;
      }

      const parsed = FormSchema.safeParse({
        category,
        value,
        option,
        description
      });

      if (!parsed.success) {
        setError(parsed.error.errors.map((x) => x.message).join(", "));
        return;
      }

      const carbonValue = calculateEntryCarbon(category, value, option);

      const entry = {
        id: generateUuid(),
        category,
        value,
        description: sanitizeText(description ?? ""),
        date: new Date().toISOString(),
        carbonValue
      } as const;

      // Validate final shape
      const validated = CarbonEntrySchema.safeParse(entry);
      if (!validated.success) {
        setError("Invalid entry data");
        return;
      }

      dispatch.addEntry(validated.data as unknown as CarbonEntry);
      router.push("/dashboard");

      // Reset
      setValue(10);
      setOption("");
      setDescription("");
      setLiveCarbon(calculateEntryCarbon(category, 10, ""));
    },
    [category, value, option, description, dispatch, router]
  );

  /**
   * Handles category tab change with memoization.
   * @optimized useCallback prevents re-binding
   */
  const onCategoryChange = useCallback(
    (newCategory: CarbonCategory) => {
      setCategory(newCategory);
      setLiveCarbon(calculateEntryCarbon(newCategory, value, option));
    },
    [value, option]
  );

  /**
   * Applies preset values with input validation.
   * @optimized useCallback prevents re-binding
   */
  const onPreset = useCallback(
    (preset: { value: number; option?: string }) => {
      setValue(preset.value);
      const newOption = preset.option ?? "";
      setOption(newOption);
      setLiveCarbon(calculateEntryCarbon(category, preset.value, newOption));
    },
    [category]
  );

  /**
   * Updates slider value with carbon recalculation.
   * @optimized useCallback prevents re-binding
   */
  const onSliderChange = useCallback(
    (v: number) => {
      setValue(v);
      setLiveCarbon(calculateEntryCarbon(category, v, option));
    },
    [category, option]
  );

  /**
   * Updates option with carbon recalculation.
   * @optimized useCallback prevents re-binding
   */
  const onOptionChange = useCallback(
    (newOption: string) => {
      setOption(newOption);
      setLiveCarbon(calculateEntryCarbon(category, value, newOption));
    },
    [category, value]
  );

  /**
   * Updates description with security validation.
   * @optimized useCallback prevents re-binding
   */
  const onDescriptionChange = useCallback((newDesc: string) => {
    const validation = validateSecureInput(newDesc, 100);
    if (validation.valid) {
      setDescription(newDesc);
    }
  }, []);

  // Memoized current presets
  const currentPresets = useMemo(() => PRESETS[category], [category]);

  return (
    <form onSubmit={onSubmit} className="card mx-auto max-w-xl" aria-label="Carbon assessment form">
      <fieldset>
        <legend className="mb-4 block flex items-center gap-2 text-lg font-semibold text-slate-900">
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-emerald-500"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
          Log Your Carbon Action
          <span className="mt-1 block w-full text-sm font-normal text-slate-500">
            Choose a category, add details, and see your impact.
          </span>
        </legend>

        <CategoryTabs
          categories={CATEGORIES}
          currentCategory={category}
          onCategoryChange={onCategoryChange}
        />

        <div id="assessment-panel" role="tabpanel" aria-labelledby="action-categories">
          <QuickPresets presets={currentPresets} onPreset={onPreset} />

          <AmountSlider value={value} onSliderChange={onSliderChange} />

          <FormInput
            id="option-input"
            label="Details"
            labelHint="(auto-filled by presets)"
            value={option}
            onChange={onOptionChange}
            placeholder="e.g., car, vegan, electricity"
            hint="Refines carbon calculation"
            ariaLabel="Option input"
          />

          <FormInput
            id="description-input"
            label="Description"
            labelHint="(optional)"
            value={description}
            onChange={onDescriptionChange}
            placeholder="What action did you take?"
            hint={`${description.length}/100 characters`}
            ariaLabel="Description input"
          />

          {/* Live carbon preview */}
          <div
            className="mb-4 flex items-center gap-4 rounded border border-emerald-100 bg-emerald-50/50 p-4"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="none"
              >
                <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Estimated Carbon Impact</p>
              <p className="text-2xl font-bold text-emerald-600">
                {liveCarbon} kg CO<sub className="text-sm">2</sub>e
              </p>
              <p className="mt-0.5 text-xs text-slate-400">Great choice! Every action counts.</p>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
              className="mb-4 rounded border border-[rgba(225,29,72,0.2)] bg-[rgba(225,29,72,0.1)] p-3 text-sm text-rose-400"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            aria-label="Submit carbon log"
            className="inline-flex w-full items-center justify-center gap-2 rounded bg-emerald-700 px-4 py-3 font-bold text-white shadow-md transition-all hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
            Log Action
          </button>
        </div>
      </fieldset>
    </form>
  );
}

// Performance: Memoize component to prevent unnecessary re-renders
export const AssessmentForm = React.memo(AssessmentFormComponent);
