'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { IoWarning } from 'react-icons/io5'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <IoWarning size={80} className="text-yellow-400 mb-6" />
      <h2 className="text-3xl font-bold text-white mb-3">
        ¡Algo salió mal!
      </h2>
      <p className="text-white/80 mb-8 max-w-md">
        No pudimos cargar la información del Pokémon. Esto puede deberse a un problema de conexión con la PokéAPI.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 px-6 rounded-lg transition"
        >
          Intentar de nuevo
        </button>
        <Link
          href="/pokemon"
          className="bg-black bg-opacity-30 hover:bg-opacity-50 text-white font-bold py-3 px-6 rounded-lg transition"
        >
          Volver al Pokédex
        </Link>
      </div>
    </div>
  )
}