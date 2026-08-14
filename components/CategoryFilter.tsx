"use client";

interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const active = category === selected;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelect(category)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              active
                ? "bg-zinc-900 text-white shadow-sm"
                : "border border-zinc-200 bg-white text-zinc-600"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}