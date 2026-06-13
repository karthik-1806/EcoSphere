"use client";

import React from "react";

export interface Preset {
  label: string;
  value: number;
  option?: string;
}

interface QuickPresetsProps {
  presets: readonly Preset[];
  onPreset: (preset: Preset) => void;
}

/**
 * QuickPresets component for quickly selecting common carbon values.
 * @param presets - List of presets available for the selected category.
 * @param onPreset - Callback when a preset is selected.
 * @returns JSX Element
 */
export const QuickPresets: React.FC<QuickPresetsProps> = ({ presets, onPreset }) => {
  return (
    <div className="mb-4">
      <span id="quick-presets-label" className="mb-2 block text-sm font-bold text-slate-800">
        Quick Presets
      </span>
      <div className="flex flex-wrap gap-2" role="group" aria-labelledby="quick-presets-label">
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => onPreset(p)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onPreset(p);
              }
            }}
            aria-label={`Preset: ${p.label}`}
            className="rounded border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 shadow-sm transition-colors hover:border-emerald-300 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default React.memo(QuickPresets);
