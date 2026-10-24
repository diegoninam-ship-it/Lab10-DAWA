// src/app/characters/not-found.tsx
import Link from 'next/link'
import { IoSadOutline } from 'react-icons/io5'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <IoSadOutline size={80} className="text-white/70 mb-6" />
      <h2 className="text-3xl font-bold text-white mb-3">Personaje no encontrado</h2>
      <p className="text-white/80 mb-8 max-w-md">
        No existe ningún personaje con ese identificador en el multiverso.
      </p>
      <Link
        href="/characters"
        className="bg-green-500 hover:bg-green-400 text-black font-bold py-3 px-6 rounded-lg transition"
      >
        Volver al inicio
      </Link>
    </div>
  )
}