"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({
  value,
  onChange,
}: SearchBarProps) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl">
        🔎
      </span>

      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar drink..."
        className="h-14 w-full rounded-2xl border border-zinc-200 bg-white pl-12 pr-4 text-base outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
      />
    </div>
  );
}