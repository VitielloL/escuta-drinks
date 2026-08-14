import Link from "next/link";
import { Drink } from "@/types/drink";

interface DrinkCardProps {
  drink: Drink;
}

export default function DrinkCard({ drink }: DrinkCardProps) {
  return (
    <Link
      href={`/drinks/${drink.id}`}
      className="block overflow-hidden rounded-3xl border border-zinc-200 bg-white transition active:scale-[0.98] hover:border-zinc-300"
    >
      {drink.image && (
        <div className="aspect-square w-full overflow-hidden bg-zinc-100">
          <img
            src={drink.image}
            alt={drink.name}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-bold text-zinc-900">
              {drink.name}
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              {drink.category}
            </p>
          </div>

          <span className="text-xl">→</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-lg bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600">
            {drink.method}
          </span>

          <span className="rounded-lg bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600">
            {drink.glass}
          </span>
        </div>
      </div>
    </Link>
  );
}