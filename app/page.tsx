"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import DrinkCard from "@/components/DrinkCard";
import { categories, drinks } from "@/data/drinks";

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [showLifeModal, setShowLifeModal] = useState(false);

  const handleCloseWelcome = () => {
    setShowWelcomeModal(false);
    setShowLifeModal(true);
  };

  const handleCloseLifeModal = () => {
    setShowLifeModal(false);
  };

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
    <>
      {showWelcomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-4xl border border-white/10 bg-[#121212] p-5 text-center text-zinc-100 shadow-2xl">
            <div className="mx-auto mb-4 h-28 w-28 overflow-hidden rounded-full border-2 border-zinc-200/80 bg-zinc-800">
              <Image
                src="/images/lara-img.jpg"
                alt="Lara Frutuoso"
                width={112}
                height={112}
                className="h-full w-full object-cover"
              />
            </div>

            <p className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-400">
              Escuta
            </p>

            <h2 className="mt-3 text-2xl font-black leading-tight text-white">
              Oi, eu sou Lara Frutuoso
            </h2>

            <p className="mt-3 text-sm leading-6 text-zinc-300">
              Bartender da casa e vou fazer os melhores drinks possíveis nessa noite 🌙🍸 <br />
              <span className="font-medium text-zinc-100">(a bartender favorita do Vit)</span>
            </p>

            <button
              type="button"
              onClick={handleCloseWelcome}
              className="mt-6 w-full rounded-full bg-white px-4 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200"
            >
              Entrar
            </button>
          </div>
        </div>
      )}

      {showLifeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-4xl border border-white/10 bg-[#121212] p-5 text-center text-zinc-100 shadow-2xl">
            <div className="mx-auto mb-4 h-28 w-28 overflow-hidden rounded-full border-2 border-zinc-200/80 bg-zinc-800">
              <Image
                src="/images/drinks/a-vida.png"
                alt="A vida"
                width={112}
                height={112}
                className="h-full w-full object-cover"
              />
            </div>

            <p className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-400">
              Escuta
            </p>

            <h2 className="mt-3 text-2xl font-black leading-tight text-white">
              A vida
            </h2>

            <p className="mt-3 text-sm leading-6 text-zinc-300">
              Irmão, a vida é foda. Beba com moderação, viva um dia de cada vez, se hidrate e seja o mais feliz possível sem fazer mal a ninguém. (ou ao mínimo possível de pessoas)✨
            </p>

            <button
              type="button"
              onClick={handleCloseLifeModal}
              className="mt-6 w-full rounded-full bg-white px-4 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200"
            >
              Entrar
            </button>
          </div>
        </div>
      )}

      <main className="min-h-screen bg-[#f5f1ed]">
        <div className="mx-auto min-h-screen max-w-2xl bg-[#f5f1ed] px-4 pb-8 pt-5">
          <header className="mb-5 rounded-[28px] border border-zinc-200 bg-white p-3.5 shadow-[0_10px_25px_rgba(24,24,27,0.04)]">
            <div className="flex items-center gap-3">
              <Image
                src="/images/escuta-logo.jpg"
                alt="Escuta"
                width={64}
                height={64}
                className="h-14 w-14 rounded-2xl object-cover"
              />

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                  Escuta
                </p>

                <h1 className="mt-1 text-2xl font-black tracking-tight text-zinc-950">
                  Drinks
                </h1>
              </div>
            </div>

            <p className="mt-3 text-xs text-zinc-500">
              Consulte rapidamente as receitas durante o serviço.
            </p>
          </header>

          <section className="mb-4">
            <SearchBar
              value={search}
              onChange={setSearch}
            />
          </section>

          <section className="mb-5">
            <CategoryFilter
              categories={categories}
              selected={category}
              onSelect={setCategory}
            />
          </section>

          <section>
            <div className="mb-2.5 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-zinc-700">
                Drinks
              </h2>

              <span className="text-xs text-zinc-500">
                {filteredDrinks.length}
              </span>
            </div>

            <div className="space-y-2.5">
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

          <footer className="mt-8 border-t border-zinc-200 pt-5 text-center text-xs text-zinc-500">
            <p className="font-medium text-zinc-700">
              Bar tender: Lara Frutuoso
            </p>

            <p className="mt-2">
              Desenvolvido por Vitiello Programador e artista em todas as plataformas digitais
            </p>

            <a
              href="https://linktr.ee/vitiellolucas"
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-2 font-semibold text-zinc-700 underline underline-offset-2"
            >
              <span aria-hidden="true">♪</span>
              Spotify / linktree
            </a>
          </footer>
        </div>
      </main>
    </>
  );
}