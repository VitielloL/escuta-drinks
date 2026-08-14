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
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              active
                ? "bg-zinc-900 text-white"
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