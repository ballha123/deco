import type { Metadata } from "next";
import "./globals.css"; // Assure l'importation de Tailwind CSS

export const metadata: Metadata = {
  title: "Boutique Décoration - Élégance Intérieure",
  description: "Découvrez notre collection exclusive d'articles de décoration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        {/* 'children' représente la page actuelle (votre page.tsx) */}
        {children}
      </body>
    </html>
  );
}