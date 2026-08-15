import { NextResponse } from "next/server";
import { deprecatedCategories, drinks as fallbackDrinks } from "@/data/drinks";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { Drink } from "@/types/drink";

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

  const tags = Array.isArray(raw.tags)
    ? raw.tags.filter((item): item is string => typeof item === "string")
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
    tags,
  };
}

export async function GET() {
  const client = createSupabaseServerClient();

  const visibleFallbackDrinks = fallbackDrinks.filter(
    (drink) => !deprecatedCategories.has(drink.category)
  );

  if (!client) {
    return NextResponse.json(visibleFallbackDrinks);
  }

  const { data, error } = await client.from("drinks").select("*").order("created_at", { ascending: false });

  if (error || !data) {
    return NextResponse.json(visibleFallbackDrinks);
  }

  const sanitized = data
    .map((row) => normalizeDrink(row as Record<string, unknown>))
    .filter((drink) => !deprecatedCategories.has(drink.category));

  return NextResponse.json(sanitized);
}

export async function POST(request: Request) {
  const client = createSupabaseServerClient();

  if (!client) {
    return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
  }

  const body = await request.json();
  const payload = {
    id: String(body.id ?? crypto.randomUUID()),
    name: String(body.name ?? ""),
    category: String(body.category ?? "Sem categoria"),
    garnish: String(body.garnish ?? ""),
    method: String(body.method ?? ""),
    glass: String(body.glass ?? ""),
    image: String(body.image ?? ""),
    history: String(body.history ?? ""),
    ingredients: Array.isArray(body.ingredients) ? body.ingredients : [],
    preparation: Array.isArray(body.preparation) ? body.preparation : [],
    tags: Array.isArray(body.tags) ? body.tags : [],
  };

  const { data, error } = await client.from("drinks").upsert(payload).select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data?.[0] ?? payload);
}
