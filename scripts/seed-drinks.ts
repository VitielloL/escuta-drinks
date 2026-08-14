import * as dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { drinks } from "../data/drinks";

dotenv.config({ path: ".env.local" });

dotenv.config();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error("Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local");
}

const supabase = createClient(url, key, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

async function main() {
  const rows = drinks.map((drink) => ({
    id: drink.id,
    name: drink.name,
    category: drink.category,
    garnish: drink.garnish,
    method: drink.method,
    glass: drink.glass,
    image: drink.image ?? "",
    history: drink.history ?? "",
    ingredients: drink.ingredients ?? [],
    preparation: drink.preparation ?? [],
    tags: drink.tags ?? [],
    created_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from("drinks").upsert(rows, { onConflict: "id" });

  if (error) {
    console.error("Erro ao sincronizar drinks:", error.message);
    process.exit(1);
  }

  console.log(`Sincronizados ${rows.length} drinks no Supabase.`);
}

main();
