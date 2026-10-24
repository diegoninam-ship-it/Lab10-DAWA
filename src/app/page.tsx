import Link from "next/link";
import { IoGameController, IoPlanet } from "react-icons/io5";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
          Next.js — SSG & ISR
        </h1>
        <p className="text-white/70 mb-12 text-lg">
          Laboratorio 10 · Enrutamiento y Páginas
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link
            href="/pokemon"
            className="flex items-center gap-3 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-4 px-8 rounded-xl transition transform hover:scale-105"
          >
            <IoGameController size={28} /> Pokédex
          </Link>

          <Link
            href="/characters"
            className="flex items-center gap-3 bg-green-500 hover:bg-green-400 text-black font-bold py-4 px-8 rounded-xl transition transform hover:scale-105"
          >
            <IoPlanet size={28} /> Rick and Morty
          </Link>
        </div>
      </div>
    </div>
  );
}