import Link from "next/link";
import Image from "next/image";
import { IoArrowBack, IoArrowForward, IoPeople } from "react-icons/io5";
import { getCharacters } from "@/lib/rickandmorty";

interface CharactersPageProps {
  searchParams: Promise<{ page?: string }>;
}

const statusColors: Record<string, string> = {
  Alive: "bg-green-500",
  Dead: "bg-red-500",
  unknown: "bg-gray-400",
};

export default async function CharactersPage({ searchParams }: CharactersPageProps) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  const data = await getCharacters(currentPage);

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
          <IoPeople size={40} className="inline-block" /> Personajes de Rick and Morty
        </h1>
        <p className="text-white/70 mb-8">
          Página {currentPage} de {data.info.pages} · {data.info.count} personajes en total
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.results.map((character) => (
            <Link
              key={character.id}
              href={`/characters/${character.id}`}
              className="transform transition hover:scale-105"
            >
              <div className="bg-white text-gray-700 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl cursor-pointer">
                <Image
                  width={300}
                  height={300}
                  src={character.image}
                  alt={character.name}
                  className="w-full h-48 object-cover"
                  priority={false}
                />
                <div className="p-4">
                  <h2 className="font-bold truncate">{character.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-2 h-2 rounded-full ${statusColors[character.status]}`} />
                    <span className="text-sm text-gray-500">
                      {character.status} · {character.species}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center items-center gap-4 mt-12">
          {data.info.prev ? (
            <Link
              href={`/characters?page=${currentPage - 1}`}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              <IoArrowBack /> Anterior
            </Link>
          ) : (
            <span className="flex items-center gap-2 bg-white/5 text-white/30 font-bold py-3 px-6 rounded-lg cursor-not-allowed">
              <IoArrowBack /> Anterior
            </span>
          )}

          <span className="text-white font-semibold">{currentPage} / {data.info.pages}</span>

          {data.info.next ? (
            <Link
              href={`/characters?page=${currentPage + 1}`}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              Siguiente <IoArrowForward />
            </Link>
          ) : (
            <span className="flex items-center gap-2 bg-white/5 text-white/30 font-bold py-3 px-6 rounded-lg cursor-not-allowed">
              Siguiente <IoArrowForward />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}