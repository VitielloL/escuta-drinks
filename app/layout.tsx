import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ficha Técnica | Drinks",
  description: "Consulta rápida de fichas técnicas para bartenders",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}