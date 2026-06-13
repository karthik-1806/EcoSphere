"use client";

import React from "react";

interface AmountSliderProps {
  value: number;
  onSliderChange: (value: number) => void;
  min?: number;
  max?: number;
}

/**
 * AmountSlider component to select the numeric value for the carbon assessment.
 * @param value - The current value of the slider.
 * @param onSliderChange - Callback when the slider value changes.
 * @param min - Minimum value of the slider.
 * @param max - Maximum value of the slider.
 * @returns JSX Element
 */
export const AmountSlider: React.FC<AmountSliderProps> = ({
  value,
  onSliderChange,
  min = 0,
  max = 100
}) => {
  return (
    <div className="mb-4">
      <label htmlFor="amount-slider" className="mb-2 block text-sm font-bold text-slate-800">
        Amount: <span className="text-emerald-600">{value}</span>
      </label>
      <input
        id="amount-slider"
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onSliderChange(Number(e.target.value))}
        aria-label="Amount slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        className="h-2 w-full cursor-pointer rounded bg-[rgba(255,255,255,0.05)]"
      />
      <div className="mt-1 flex justify-between text-xs font-medium text-slate-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default React.memo(AmountSlider);
