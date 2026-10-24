import { ReactNode } from "react";
import { Metadata } from "next";
import { IoPlanet } from "react-icons/io5";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rick and Morty - Next.js",
  description: "Explora el multiverso de Rick and Morty",
};

interface CharactersLayoutProps {
  children: ReactNode;
}

export default function CharactersLayout({ children }: CharactersLayoutProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-green-900 to-black">
      <nav className="bg-black bg-opacity-30 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/characters"
            className="text-white text-2xl font-bold hover:text-green-400 transition"
          >
            <IoPlanet size={30} className="inline-block" /> Rick and Morty
          </Link>
          <Link
            href="/characters/search"
            className="text-white hover:text-green-400 transition font-semibold"
          >
            Búsqueda
          </Link>
        </div>
      </nav>
      {children}
    </div>
  );
}