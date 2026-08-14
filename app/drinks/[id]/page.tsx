import Link from "next/link";
import { notFound } from "next/navigation";
import { drinks } from "@/data/drinks";

interface DrinkPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DrinkPage({
  params,
}: DrinkPageProps) {
  const { id } = await params;

  const drink = drinks.find((item) => item.id === id);

  if (!drink) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-100">
      <div className="mx-auto min-h-screen max-w-2xl px-4 pb-10 pt-5">
        <Link
          href="/"
          className="inline-flex items-center gap-2 py-2 text-sm font-medium text-zinc-600"
        >
          ← Voltar
        </Link>

        <header className="mt-5">
          <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            {drink.category}
          </p>

          <h1 className="mt-1 text-3xl font-black tracking-tight text-zinc-950">
            {drink.name}
          </h1>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs font-medium uppercase text-zinc-400">
                Método
              </p>

              <p className="mt-1 font-semibold text-zinc-900">
                {drink.method}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs font-medium uppercase text-zinc-400">
                Copo
              </p>

              <p className="mt-1 font-semibold text-zinc-900">
                {drink.glass}
              </p>
            </div>
          </div>
        </header>

        <section className="mt-6 rounded-2xl bg-white p-5">
          <h2 className="text-lg font-bold text-zinc-950">
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