import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCharacterById, getAllCharacterIds } from '@/lib/rickandmorty';

interface CharacterPageProps {
  params: Promise<{
    id: string;
  }>;
}

const statusColors: Record<string, string> = {
  Alive: 'bg-green-500',
  Dead: 'bg-red-500',
  unknown: 'bg-gray-400',
};

export async function generateStaticParams() {
  const ids = await getAllCharacterIds(40); // antes: 100
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: CharacterPageProps): Promise<Metadata> {
  const { id } = await params;
  const character = await getCharacterById(id);

  if (!character) {
    return { title: 'Personaje no encontrado - Rick and Morty' };
  }

  return {
    title: `${character.name} - Rick and Morty`,
    description: `Información sobre ${character.name}, personaje de Rick and Morty`,
  };
}

export default async function CharacterDetail({ params }: CharacterPageProps) {
  const { id } = await params;
  const character = await getCharacterById(id);

  if (!character) notFound();

  const createdDate = new Date(character.created).toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-80 flex-shrink-0">
            <Image
              width={300}
              height={300}
              src={character.image}
              alt={character.name}
              className="w-full h-80 md:h-full object-cover"
              priority
            />
          </div>

          <div className="p-8 flex-1">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">{character.name}</h1>

            <div className="flex items-center gap-2 mb-6">
              <span className={`w-3 h-3 rounded-full ${statusColors[character.status]}`} />
              <span className="text-gray-600 font-semibold">
                {character.status} - {character.species}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase">Tipo</h3>
                <p>{character.type || 'No especificado'}</p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase">Género</h3>
                <p>{character.gender}</p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase">Origen</h3>
                <p>{character.origin.name}</p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase">Última ubicación</h3>
                <p>{character.location.name}</p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase">Episodios</h3>
                <p>{character.episode.length} episodio(s)</p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase">Creado el</h3>
                <p>{createdDate}</p>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/characters"
                className="inline-block bg-black hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition"
              >
                ← Volver a la lista
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}