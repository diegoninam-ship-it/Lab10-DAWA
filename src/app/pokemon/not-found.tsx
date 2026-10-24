import Link from 'next/link'
import { IoSadOutline } from 'react-icons/io5'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <IoSadOutline size={80} className="text-white/70 mb-6" />
      <h2 className="text-3xl font-bold text-white mb-3">
        Pokémon no encontrado
      </h2>
      <p className="text-white/80 mb-8 max-w-md">
        No pudimos encontrar el Pokémon que buscas. Puede que el nombre esté mal escrito o que no exista en la Pokédex.
      </p>
      <Link
        href="/pokemon"
        className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 px-6 rounded-lg transition"
      >
        Volver al Pokédex
      </Link>
    </div>
  )
}