import Image from "next/image";
import Link from "next/link";
import { Drink } from "@/types/drink";

interface DrinkCardProps {
  drink: Drink;
}

function getGlassEmoji(glass: string) {
  const normalized = glass.toLowerCase();

  if (normalized.includes("long") || normalized.includes("americano")) return "🥤";
  if (normalized.includes("rocks") || normalized.includes("on the rocks")) return "🧊";
  if (normalized.includes("flute") || normalized.includes("champagne")) return "🥂";
  if (normalized.includes("coupe") || normalized.includes("nick") || normalized.includes("nora")) return "🍸";
  if (normalized.includes("diamante") || normalized.includes("cristal")) return "💎";
  if (normalized.includes("copo") || normalized.includes("taça")) return "🥃";

  return "🍸";
}

export default function DrinkCard({ drink }: DrinkCardProps) {
  return (
    <Link
      href={`/drinks/${drink.id}`}
      className="group block overflow-hidden rounded-[26px] border border-zinc-200 bg-white shadow-[0_8px_24px_rgba(24,24,27,0.05)] transition duration-200 hover:-translate-y-0.5 hover:border-zinc-300 active:scale-[0.99]"
    >
      {drink.image && (
        <div className="aspect-square w-full overflow-hidden bg-zinc-100">
          <Image
            src={drink.image}
            alt={drink.name}
            width={900}
            height={900}
            quality={90}
            sizes="(max-width: 768px) 50vw, 25vw"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        </div>
      )}

      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-base font-bold text-zinc-900">
              {drink.name}
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              {drink.category}
            </p>
          </div>

          <span className="text-lg text-zinc-600">→</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-zinc-100 px-2 py-1 text-[10px] font-medium text-zinc-700">
            {drink.method}
          </span>

          <span className="rounded-full bg-zinc-100 px-2 py-1 text-[10px] font-medium text-zinc-700">
            {getGlassEmoji(drink.glass)} {drink.glass}
          </span>
        </div>
      </div>
    </Link>
  );
}