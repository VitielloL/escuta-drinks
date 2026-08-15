import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { drinks as fallbackDrinks } from "@/data/drinks";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { Drink } from "@/types/drink";

interface DrinkPageProps {
  params: Promise<{
    id: string;
  }>;
}

function normalizeDrink(raw: Record<string, unknown>): Drink {
  const ingredients = Array.isArray(raw.ingredients)
    ? raw.ingredients
        .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
        .map((item) => ({
          name: String(item.name ?? ""),
          amount: String(item.amount ?? ""),
          unit: String(item.unit ?? ""),
          observation: item.observation ? String(item.observation) : undefined,
        }))
        .filter((item) => item.name || item.amount || item.unit)
    : [];

  const preparation = Array.isArray(raw.preparation)
    ? raw.preparation.filter((item): item is string => typeof item === "string")
    : [];

  return {
    id: String(raw.id ?? ""),
    image: typeof raw.image === "string" ? raw.image : "",
    name: String(raw.name ?? ""),
    category: String(raw.category ?? "Sem categoria"),
    garnish: String(raw.garnish ?? ""),
    method: String(raw.method ?? ""),
    glass: String(raw.glass ?? ""),
    history: typeof raw.history === "string" ? raw.history : "",
    ingredients,
    preparation,
    tags: Array.isArray(raw.tags) ? raw.tags.filter((item): item is string => typeof item === "string") : [],
  };
}

function getGlassEmoji(glass: string) {
  const normalized = glass.toLowerCase();

  if (normalized.includes("highball") || normalized.includes("long") || normalized.includes("americano") || normalized.includes("collins")) return "🥤";
  if (normalized.includes("rocks") || normalized.includes("old fashioned") || normalized.includes("on the rocks") || normalized.includes("short") || normalized.includes("tumbler")) return "🧊";
  if (normalized.includes("flute") || normalized.includes("champagne") || normalized.includes("vinho") || normalized.includes("sparkling")) return "🥂";
  if (normalized.includes("coupe") || normalized.includes("nick") || normalized.includes("nora") || normalized.includes("martini") || normalized.includes("mix") || normalized.includes("sour")) return "🍸";
  if (normalized.includes("diamante") || normalized.includes("cristal") || normalized.includes("crystal")) return "💎";
  if (normalized.includes("copo") || normalized.includes("taça") || normalized.includes("goblet") || normalized.includes("stemless")) return "🥃";

  return "🍸";
}

export default async function DrinkPage({
  params,
}: DrinkPageProps) {
  const { id } = await params;

  const client = createSupabaseServerClient();
  let drink: Drink | null = null;

  if (client) {
    const { data, error } = await client.from("drinks").select("*").eq("id", id).maybeSingle();

    if (!error && data) {
      drink = normalizeDrink(data as Record<string, unknown>);
    }
  }

  if (!drink) {
    drink = fallbackDrinks.find((item) => item.id === id) ?? null;
  }

  if (!drink) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f5f1ed]">
      <div className="mx-auto min-h-screen max-w-2xl px-4 pb-10 pt-5">
        <Link
          href="/"
          className="inline-flex items-center gap-2 py-2 text-sm font-medium text-zinc-600"
        >
          ← Voltar
        </Link>

        <header className="mt-4">
          {drink.image && (
            <div className="mb-4 overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-[0_10px_25px_rgba(24,24,27,0.04)]">
              <Image
                src={drink.image}
                alt={drink.name}
                width={1200}
                height={600}
                quality={90}
                sizes="(max-width: 768px) 100vw, 768px"
                className="h-52 w-full object-cover"
              />
            </div>
          )}

          <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
            {drink.category}
          </p>

          <h1 className="mt-1 text-3xl font-black tracking-tight text-zinc-950">
            {drink.name}
          </h1>

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <div className="rounded-2xl bg-white p-3.5 shadow-sm">
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-400">
                Método
              </p>

              <p className="mt-1 text-sm font-semibold text-zinc-900">
                {drink.method}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-3.5 shadow-sm">
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-400">
                Copo
              </p>

              <p className="mt-1 text-sm font-semibold text-zinc-900">
                {getGlassEmoji(drink.glass)} {drink.glass}
              </p>
            </div>
          </div>
        </header>

        <section className="mt-5 rounded-2xl bg-white p-4 shadow-sm">
          <h2 className="text-base font-bold text-zinc-950">
            Ingredientes
          </h2>

          <div className="mt-4 divide-y divide-zinc-100">
            {drink.ingredients.map((ingredient, index) => (
              <div
                key={`${ingredient.name}-${index}`}
                className="flex items-center justify-between gap-4 py-3"
              >
                <div>
                  <p className="font-medium text-zinc-900">
                    {ingredient.name}
                  </p>

                  {ingredient.observation && (
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {ingredient.observation}
                    </p>
                  )}
                </div>

                <p className="shrink-0 font-bold text-zinc-900">
                  {ingredient.amount} {ingredient.unit}
                </p>
              </div>
            ))}
          </div>
        </section>

        {drink.history && (
          <section className="mt-4 rounded-2xl bg-white p-5">
            <h2 className="text-lg font-bold text-zinc-950">
              História
            </h2>

            <p className="mt-3 text-sm leading-7 text-zinc-600">
              {drink.history}
            </p>
          </section>
        )}

        <section className="mt-4 rounded-2xl bg-white p-5">
          <h2 className="text-lg font-bold text-zinc-950">
            Preparo
          </h2>

          <ol className="mt-4 space-y-4">
            {drink.preparation.map((step, index) => (
              <li
                key={index}
                className="flex gap-3"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white">
                  {index + 1}
                </span>

                <p className="pt-1 text-sm leading-6 text-zinc-600">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-4 rounded-2xl bg-white p-5">
          <p className="text-xs font-medium uppercase text-zinc-400">
            Guarnição
          </p>

          <p className="mt-1 font-semibold text-zinc-900">
            {drink.garnish}
          </p>
        </section>
      </div>
    </main>
  );
}