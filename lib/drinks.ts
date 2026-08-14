import { drinks as fallbackDrinks } from "@/data/drinks";
import type { Drink, Ingredient } from "@/types/drink";
import { createSupabaseServerClient } from "@/lib/supabase";

function normalizeArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeIngredients(value: unknown): Ingredient[] {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
      .map((item) => ({
        name: String(item.name ?? ""),
        amount: String(item.amount ?? ""),
        unit: String(item.unit ?? ""),
        observation: item.observation ? String(item.observation) : undefined,
      }))
      .filter((item) => item.name || item.amount || item.unit);
  }

  if (typeof value === "string" && value.trim()) {
    return value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => ({
        name: line,
        amount: "",
        unit: "",
      }));
  }

  return [];
}

export function normalizeDrinkRecord(record: Record<string, unknown>): Drink {
  return {
    id: String(record.id ?? ""),
    image: typeof record.image === "string" ? record.image : "",
    name: String(record.name ?? ""),
    category: String(record.category ?? "Sem categoria"),
    garnish: String(record.garnish ?? ""),
    method: String(record.method ?? ""),
    glass: String(record.glass ?? ""),
    ingredients: normalizeIngredients(record.ingredients),
    preparation: normalizeArray(record.preparation),
    history: typeof record.history === "string" ? record.history : "",
    tags: normalizeArray(record.tags),
  };
}

export async function getDrinksFromSupabase(): Promise<Drink[]> {
  const client = createSupabaseServerClient();

  if (!client) {
    return fallbackDrinks;
  }

  const { data, error } = await client.from("drinks").select("*").order("created_at", { ascending: false });

  if (error || !data) {
    return fallbackDrinks;
  }

  return data.map((row) => normalizeDrinkRecord(row as Record<string, unknown>));
}

export async function getCatalogDrinks(): Promise<Drink[]> {
  return getDrinksFromSupabase();
}
