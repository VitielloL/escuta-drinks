"use client";

import { useMemo, useState } from "react";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import DrinkCard from "@/components/DrinkCard";
import { categories, drinks } from "@/data/drinks";

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");

  const filteredDrinks = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    return drinks.filter((drink) => {
      const matchesCategory =
        category === "Todos" || drink.category === category;

      const searchableText = [
        drink.name,
        drink.category,
        drink.method,
        drink.glass,
        drink.garnish,
        ...(drink.tags ?? []),
        ...drink.ingredients.map((ingredient) => ingredient.name),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        searchableText.includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  return (
    <main className="min-h-screen bg-zinc-100">
      <div className="mx-auto min-h-screen max-w-2xl bg-zinc-100 px-4 pb-8 pt-6">
        <header className="mb-6">
          <p className="text-sm font-medium text-zinc-500">
            FICHA TÉCNICA
          </p>

          <h1 className="mt-1 text-3xl font-black tracking-tight text-zinc-950">
            Drinks
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Consulte rapidamente as receitas durante o serviço.
          </p>
        </header>

        <section className="mb-5">
          <SearchBar
            value={search}
            onChange={setSearch}
          />
        </section>

        <section className="mb-6">
          <CategoryFilter
            categories={categories}
            selected={category}
            onSelect={setCategory}
          />
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold text-zinc-900">
              Drinks
            </h2>

            <span className="text-sm text-zinc-500">
              {filteredDrinks.length}
            </span>
          </div>

          <div className="space-y-3">
            {filteredDrinks.map((drink) => (
              <DrinkCard
                key={drink.id}
                drink={drink}
              />
            ))}
          </div>

          {filteredDrinks.length === 0 && (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
              <p className="text-2xl">🍸</p>

              <p className="mt-3 font-semibold text-zinc-800">
                Nenhum drink encontrado
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                Tente outro nome, ingrediente ou categoria.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}