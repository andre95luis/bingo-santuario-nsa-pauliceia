import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BINGO – Santuário Nossa Senhora Aparecida · Paulicéia",
  description: "Sistema de Bingo para a Quermesse do Santuário NSA Paulicéia",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  );
}
