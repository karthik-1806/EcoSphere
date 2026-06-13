"use client";

import React from "react";
import { CarbonCategory } from "@/types";

interface CategoryTabsProps {
  categories: readonly CarbonCategory[];
  currentCategory: CarbonCategory;
  onCategoryChange: (category: CarbonCategory) => void;
}

/**
 * CategoryTabs component for selecting the carbon category.
 * @param categories - List of available carbon categories.
 * @param currentCategory - Currently selected category.
 * @param onCategoryChange - Callback when a new category is selected.
 * @returns JSX Element
 */
export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  currentCategory,
  onCategoryChange
}) => {
  return (
    <div
      id="action-categories"
      role="tablist"
      aria-label="Action categories"
      className="mb-6 flex gap-2"
    >
      {categories.map((c) => (
        <button
          key={c}
          type="button"
          role="tab"
          aria-controls="assessment-panel"
          aria-selected={currentCategory === c}
          aria-label={`${c} category`}
          onClick={() => onCategoryChange(c)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onCategoryChange(c);
            }
          }}
          className={`rounded px-3 py-2 capitalize transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
            currentCategory === c
              ? "border border-emerald-200 bg-emerald-50 font-medium text-emerald-700"
              : "border border-slate-200 bg-white text-slate-600 hover:text-slate-900"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
};

export default React.memo(CategoryTabs);
