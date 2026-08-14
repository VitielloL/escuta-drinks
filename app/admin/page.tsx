"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { categories } from "@/data/drinks";
import { supabase } from "@/lib/supabase";
import type { Drink, Ingredient } from "@/types/drink";

const emptyForm: Omit<Drink, "id"> & { id?: string } = {
  id: "",
  name: "",
  category: "Clássicos",
  garnish: "",
  method: "",
  glass: "",
  image: "",
  history: "",
  ingredients: [{ name: "", amount: "", unit: "" }],
  preparation: [""],
  tags: [""],
};

function parseJsonArray(value: string[]) {
  return value.map((item) => item.trim()).filter(Boolean);
}

function generateDrinkId(name: string, existingIds: string[]) {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "drink";

  let candidate = base;
  let counter = 2;

  while (existingIds.includes(candidate)) {
    candidate = `${base}-${counter}`;
    counter += 1;
  }

  return candidate;
}

function AdminPageContent() {
  const searchParams = useSearchParams();
  const [hasHydrated, setHasHydrated] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [message, setMessage] = useState("");

  const categoryOptions = useMemo(() => {
    const unique = Array.from(
      new Set([
        ...categories.filter((item) => item !== "Todos"),
        ...drinks.map((drink) => drink.category).filter(Boolean),
      ])
    );

    return unique.filter(Boolean);
  }, [drinks]);

  const glassOptions = useMemo(
    () =>
      Array.from(
        new Set(
          drinks
            .map((drink) => drink.glass)
            .filter((value): value is string => Boolean(value && value.trim()))
        )
      ),
    [drinks]
  );

  const methodOptions = useMemo(
    () =>
      Array.from(
        new Set(
          drinks
            .map((drink) => drink.method)
            .filter((value): value is string => Boolean(value && value.trim()))
        )
      ),
    [drinks]
  );

  const garnishOptions = useMemo(
    () =>
      Array.from(
        new Set(
          drinks
            .map((drink) => drink.garnish)
            .filter((value): value is string => Boolean(value && value.trim()))
        )
      ),
    [drinks]
  );

  useEffect(() => {
    const session = sessionStorage.getItem("escuta-admin");
    const loggedIn = session === "true";

    setIsLogged(loggedIn);
    setHasHydrated(true);

    if (loggedIn) {
      loadDrinks();
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated || !isLogged || drinks.length === 0) {
      return;
    }

    const editId = searchParams.get("edit");
    const newMode = searchParams.get("new");

    if (newMode === "1") {
      setShowForm(true);
      setForm({
        ...emptyForm,
        category: categoryOptions[0] ?? "Clássicos",
      });
      return;
    }

    if (editId) {
      const targetDrink = drinks.find((drink) => drink.id === editId);
      if (targetDrink) {
        setShowForm(true);
        setForm({
          id: targetDrink.id,
          name: targetDrink.name,
          category: targetDrink.category,
          garnish: targetDrink.garnish ?? "",
          method: targetDrink.method ?? "",
          glass: targetDrink.glass ?? "",
          image: targetDrink.image ?? "",
          history: targetDrink.history ?? "",
          ingredients: targetDrink.ingredients?.length ? targetDrink.ingredients : [{ name: "", amount: "", unit: "" }],
          preparation: targetDrink.preparation?.length ? targetDrink.preparation : [""],
          tags: targetDrink.tags?.length ? targetDrink.tags : [""],
        });
      }
    }
  }, [hasHydrated, isLogged, drinks, searchParams, categoryOptions]);

  async function loadDrinks() {
    const response = await fetch("/api/drinks");
    const data = await response.json();
    setDrinks(Array.isArray(data) ? data : []);
  }

  async function handleLogin() {
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
      setMessage(result.error ?? "Login inválido");
      setLoading(false);
      return;
    }

    sessionStorage.setItem("escuta-admin", "true");
    setIsLogged(true);
    setLoading(false);
    loadDrinks();
  }

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateIngredient(index: number, field: keyof Ingredient, value: string) {
    setForm((prev) => {
      const nextIngredients = [...(prev.ingredients ?? [])];
      nextIngredients[index] = {
        ...nextIngredients[index],
        [field]: value,
      };
      return { ...prev, ingredients: nextIngredients };
    });
  }

  function addIngredient() {
    setForm((prev) => ({
      ...prev,
      ingredients: [...(prev.ingredients ?? []), { name: "", amount: "", unit: "" }],
    }));
  }

  function removeIngredient(index: number) {
    setForm((prev) => ({
      ...prev,
      ingredients: (prev.ingredients ?? []).filter((_, i) => i !== index),
    }));
  }

  function addPreparationStep() {
    setForm((prev) => ({ ...prev, preparation: [...(prev.preparation ?? []), ""] }));
  }

  function updatePreparationStep(index: number, value: string) {
    setForm((prev) => {
      const next = [...(prev.preparation ?? [])];
      next[index] = value;
      return { ...prev, preparation: next };
    });
  }

  function removePreparationStep(index: number) {
    setForm((prev) => ({
      ...prev,
      preparation: (prev.preparation ?? []).filter((_, i) => i !== index),
    }));
  }

  function addTag() {
    setForm((prev) => ({ ...prev, tags: [...(prev.tags ?? []), ""] }));
  }

  function updateTag(index: number, value: string) {
    setForm((prev) => {
      const next = [...(prev.tags ?? [])];
      next[index] = value;
      return { ...prev, tags: next };
    });
  }

  function removeTag(index: number) {
    setForm((prev) => ({
      ...prev,
      tags: (prev.tags ?? []).filter((_, i) => i !== index),
    }));
  }

  async function uploadDrinkImage(file: File) {
    if (!supabase) {
      setMessage("Supabase não configurado para upload de imagem.");
      return;
    }

    const bucketName = "drinks";
    const fileName = `images/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const { error } = await supabase.storage.from(bucketName).upload(fileName, file, {
      upsert: true,
      contentType: file.type || "image/jpeg",
    });

    if (error) {
      const errorMessage = error.message?.toLowerCase() ?? "";
      const isMissingBucket =
        errorMessage.includes("bucket not found") ||
        errorMessage.includes("nosuchbucket") ||
        errorMessage.includes("not found");

      setMessage(
        isMissingBucket
          ? `Bucket "${bucketName}" não existe. Crie este bucket no Supabase Storage e deixe-o público.`
          : `Não foi possível enviar a imagem: ${error.message}`
      );
      return;
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);
    setForm((prev) => ({ ...prev, image: data.publicUrl }));
    setMessage("Imagem enviada com sucesso!");
  }

  async function submitDrink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const sanitizedName = form.name.trim();
    if (!sanitizedName) {
      setMessage("Nome do drink é obrigatório.");
      return;
    }

    const payload: Drink = {
      id: form.id && form.id.trim() ? form.id.trim() : generateDrinkId(sanitizedName, drinks.map((drink) => drink.id)),
      name: sanitizedName,
      category: form.category || categoryOptions[0] || "Clássicos",
      garnish: form.garnish,
      method: form.method,
      glass: form.glass,
      image: form.image,
      history: form.history,
      ingredients: (form.ingredients ?? []).map((ingredient) => ({
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
        observation: ingredient.observation ?? undefined,
      })),
      preparation: parseJsonArray(form.preparation ?? []),
      tags: parseJsonArray(form.tags ?? []),
    };

    const response = await fetch("/api/drinks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      setMessage(result.error ?? "Erro ao salvar drink");
      return;
    }

    setMessage("Drink salvo com sucesso!");
    setShowForm(false);
    setForm(emptyForm);
    loadDrinks();
  }

  async function deleteDrink(id: string) {
    const response = await fetch(`/api/drinks/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setMessage("Drink removido com sucesso!");
      loadDrinks();
    } else {
      setMessage("Erro ao remover drink");
    }
  }

  if (!hasHydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f1ed] px-4">
        <div className="w-full max-w-sm rounded-[28px] bg-white p-6 shadow-lg">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">Escuta</p>
          <h1 className="mt-3 text-3xl font-black text-zinc-900">Admin</h1>
          <div className="mt-5 animate-pulse space-y-3">
            <div className="h-11 rounded-xl bg-zinc-100" />
            <div className="h-11 rounded-xl bg-zinc-100" />
            <div className="h-12 rounded-full bg-zinc-100" />
          </div>
        </div>
      </main>
    );
  }

  if (!isLogged) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f1ed] px-4">
        <div className="w-full max-w-sm rounded-[28px] bg-white p-6 shadow-lg">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">Escuta</p>
          <h1 className="mt-3 text-3xl font-black text-zinc-900">Admin</h1>

          <div className="mt-5 space-y-3">
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Usuário"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 outline-none"
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Senha"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 outline-none"
            />
          </div>

          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="mt-5 w-full rounded-full bg-zinc-900 px-4 py-3 font-semibold text-white"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <Link
            href="/"
            className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-800"
          >
            Voltar para a tela principal
          </Link>

          {message && <p className="mt-3 text-sm text-red-600">{message}</p>}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f1ed] p-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">Escuta</p>
            <h1 className="text-3xl font-black text-zinc-900">Painel Admin</h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-800"
            >
              Menu
            </Link>

            <button
              type="button"
              onClick={() => {
                sessionStorage.removeItem("escuta-admin");
                setIsLogged(false);
              }}
              className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-800"
            >
              Sair
            </button>
          </div>
        </div>

        {message && <p className="mb-4 rounded-xl bg-zinc-900 px-3 py-2 text-sm text-white">{message}</p>}

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] bg-white p-5 shadow-sm">
            {!showForm && (
              <div className="flex min-h-[160px] items-center justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(true);
                    setForm({
                      ...emptyForm,
                      category: categoryOptions[0] ?? "Clássicos",
                    });
                  }}
                  className="rounded-full bg-zinc-900 px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white"
                >
                  Adicionar
                </button>
              </div>
            )}

            {showForm && (
              <form onSubmit={submitDrink}>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-xl font-black text-zinc-900">Adicionar / editar drink</h2>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setForm(emptyForm);
                    }}
                    className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700"
                  >
                    Recolher
                  </button>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <label className="space-y-1 text-sm font-medium text-zinc-700 md:col-span-2">
                    <span>Nome</span>
                    <input
                      required
                      value={form.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 outline-none"
                    />
                  </label>

                  <label className="space-y-1 text-sm font-medium text-zinc-700">
                    <span>Categoria</span>
                    <select
                      value={form.category || categoryOptions[0] || "Clássicos"}
                      onChange={(event) => updateField("category", event.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 outline-none"
                    >
                      {categoryOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-1 text-sm font-medium text-zinc-700">
                    <span>Imagem</span>
                    <input
                      value={form.image}
                      onChange={(event) => updateField("image", event.target.value)}
                      placeholder="https://... ou /images/..."
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 outline-none"
                    />
                  </label>

                  <label className="space-y-1 text-sm font-medium text-zinc-700 md:col-span-2">
                    <span>Enviar imagem para o banco</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          void uploadDrinkImage(file);
                        }
                      }}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 outline-none"
                    />
                  </label>

                  <label className="space-y-1 text-sm font-medium text-zinc-700 md:col-span-2">
                    <span>Guarnição</span>
                    <input
                      list="garnish-options"
                      value={form.garnish}
                      onChange={(event) => updateField("garnish", event.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 outline-none"
                    />
                    <datalist id="garnish-options">
                      {garnishOptions.map((option) => (
                        <option key={option} value={option} />
                      ))}
                    </datalist>
                  </label>

                  <label className="space-y-1 text-sm font-medium text-zinc-700">
                    <span>Método</span>
                    <input
                      list="method-options"
                      value={form.method}
                      onChange={(event) => updateField("method", event.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 outline-none"
                    />
                    <datalist id="method-options">
                      {methodOptions.map((option) => (
                        <option key={option} value={option} />
                      ))}
                    </datalist>
                  </label>

                  <label className="space-y-1 text-sm font-medium text-zinc-700">
                    <span>Copo</span>
                    <input
                      list="glass-options"
                      value={form.glass}
                      onChange={(event) => updateField("glass", event.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 outline-none"
                    />
                    <datalist id="glass-options">
                      {glassOptions.map((option) => (
                        <option key={option} value={option} />
                      ))}
                    </datalist>
                  </label>
                </div>

                <div className="mt-5 space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-bold text-zinc-900">Ingredientes</h3>
                      <button type="button" onClick={addIngredient} className="text-sm font-semibold text-zinc-900">+ adicionar</button>
                    </div>

                    {(form.ingredients ?? []).map((ingredient, index) => (
                      <div key={index} className="mb-3 grid gap-2 rounded-xl border border-zinc-200 p-3 md:grid-cols-[1.3fr_0.5fr_0.5fr_auto]">
                        <input
                          value={ingredient.name}
                          onChange={(event) => updateIngredient(index, "name", event.target.value)}
                          placeholder="Nome"
                          className="rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-2 outline-none"
                        />
                        <input
                          value={ingredient.amount}
                          onChange={(event) => updateIngredient(index, "amount", event.target.value)}
                          placeholder="20"
                          className="rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-2 outline-none"
                        />
                        <input
                          value={ingredient.unit}
                          onChange={(event) => updateIngredient(index, "unit", event.target.value)}
                          placeholder="ml"
                          className="rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-2 outline-none"
                        />
                        <button type="button" onClick={() => removeIngredient(index)} className="rounded-lg bg-red-100 px-2 py-2 text-sm text-red-800">Remover</button>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-bold text-zinc-900">Preparo</h3>
                      <button type="button" onClick={addPreparationStep} className="text-sm font-semibold text-zinc-900">+ adicionar</button>
                    </div>
                    {(form.preparation ?? []).map((step, index) => (
                      <div key={index} className="mb-2 flex gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white">{index + 1}</span>
                        <input
                          value={step}
                          onChange={(event) => updatePreparationStep(index, event.target.value)}
                          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 outline-none"
                        />
                        <button type="button" onClick={() => removePreparationStep(index)} className="rounded-lg bg-red-100 px-2 py-2 text-sm text-red-800">x</button>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-bold text-zinc-900">Tags</h3>
                      <button type="button" onClick={addTag} className="text-sm font-semibold text-zinc-900">+ adicionar</button>
                    </div>
                    {(form.tags ?? []).map((tag, index) => (
                      <div key={index} className="mb-2 flex gap-2">
                        <input
                          value={tag}
                          onChange={(event) => updateTag(index, event.target.value)}
                          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 outline-none"
                        />
                        <button type="button" onClick={() => removeTag(index)} className="rounded-lg bg-red-100 px-2 py-2 text-sm text-red-800">x</button>
                      </div>
                    ))}
                  </div>

                  <label className="block space-y-1 text-sm font-medium text-zinc-700">
                    <span>História</span>
                    <textarea
                      value={form.history}
                      onChange={(event) => updateField("history", event.target.value)}
                      rows={5}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 outline-none"
                    />
                  </label>
                </div>

                <button type="submit" className="mt-6 w-full rounded-full bg-zinc-900 px-4 py-3 font-semibold text-white">
                  Salvar drink
                </button>
              </form>
            )}
          </div>

          <aside className="rounded-[28px] bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-zinc-900">Drinks cadastrados</h2>
            <div className="mt-4 space-y-3">
              {drinks.length === 0 && <p className="text-sm text-zinc-500">Nenhum drink cadastrado ainda.</p>}

              {drinks.map((drink) => (
                <div key={drink.id} className="rounded-2xl border border-zinc-200 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-zinc-900">{drink.name}</p>
                      <p className="text-xs text-zinc-500">{drink.category}</p>
                    </div>
                    <button type="button" onClick={() => void deleteDrink(drink.id)} className="text-xs font-semibold text-red-700">Excluir</button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(true);
                      setForm({
                        id: drink.id,
                        name: drink.name,
                        category: drink.category,
                        garnish: drink.garnish ?? "",
                        method: drink.method ?? "",
                        glass: drink.glass ?? "",
                        image: drink.image ?? "",
                        history: drink.history ?? "",
                        ingredients: drink.ingredients ?? [{ name: "", amount: "", unit: "" }],
                        preparation: drink.preparation ?? [""],
                        tags: drink.tags ?? [""],
                      });
                    }}
                    className="mt-3 w-full rounded-full border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-semibold text-zinc-800"
                  >
                    Editar
                  </button>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#f5f1ed] text-zinc-700">Carregando admin...</div>}>
      <AdminPageContent />
    </Suspense>
  );
}
