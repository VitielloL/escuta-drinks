import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const client = createSupabaseServerClient();

  if (!client) {
    return NextResponse.json(
      {
        error:
          "Supabase não configurado. Defina NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY e SUPABASE_SERVICE_ROLE_KEY no ambiente da Vercel.",
      },
      { status: 500 }
    );
  }

  const { error } = await client.from("drinks").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
