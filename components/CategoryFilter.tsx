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
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => {
        const active = category === selected;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelect(category)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
              active
                ? "bg-zinc-900 text-white"
                : "bg-white text-zinc-600 border border-zinc-200"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}