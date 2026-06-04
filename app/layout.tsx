import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "YouCrowd — teste sua oferta antes do tráfego",
  description:
    "Painel de compradores sintéticos que verbalizam objeções a uma oferta, ao vivo, sem gastar 1 centavo em tráfego.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
