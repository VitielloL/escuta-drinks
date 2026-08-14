import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const expectedUsername = process.env.ADMIN_USERNAME ?? "admin";
  const expectedPassword = process.env.ADMIN_PASSWORD ?? "admin";

  if (username === expectedUsername && password === expectedPassword) {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: "Credenciais inválidas" }, { status: 401 });
}
