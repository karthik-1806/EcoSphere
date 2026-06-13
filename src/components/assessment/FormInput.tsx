"use client";

import React from "react";

interface FormInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
  hint?: React.ReactNode;
  labelHint?: React.ReactNode;
  ariaLabel?: string;
}

/**
 * Reusable text input component for forms.
 * @param id - The HTML id for the input element.
 * @param label - The label text for the input.
 * @param value - The current value of the input.
 * @param onChange - Callback when the input value changes.
 * @param maxLength - Maximum length of the input.
 * @param placeholder - Placeholder text for the input.
 * @param hint - Additional hint text displayed below the input.
 * @param labelHint - Additional hint text displayed next to the label.
 * @param ariaLabel - Explicit aria-label for accessibility (defaults to `${label} input`)
 * @returns JSX Element
 */
export const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  value,
  onChange,
  maxLength = 100,
  placeholder = "",
  hint,
  labelHint,
  ariaLabel
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="mb-2 block text-sm font-bold text-slate-800">
        {label}{" "}
        {labelHint && <span className="text-xs font-normal text-slate-500">{labelHint}</span>}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        aria-label={ariaLabel || `${label} input`}
        aria-describedby={`${id}-hint`}
        className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
        placeholder={placeholder}
      />
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-slate-400">
          {hint}
        </p>
      )}
    </div>
  );
};

export default React.memo(FormInput);
