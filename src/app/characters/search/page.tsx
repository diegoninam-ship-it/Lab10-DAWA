'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { IoSearch, IoWarning } from 'react-icons/io5'
import { searchCharacters } from '@/lib/rickandmorty'
import { Character } from '@/types/rickandmorty'

const statusColors: Record<string, string> = {
  Alive: 'bg-green-500',
  Dead: 'bg-red-500',
  unknown: 'bg-gray-400',
}

export default function SearchPage() {
  const [name, setName] = useState('')
  const [status, setStatus] = useState('')
  const [type, setType] = useState('')
  const [gender, setGender] = useState('')

  const [results, setResults] = useState<Character[]>([])
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  // Búsqueda en tiempo real con debounce, disparada por cualquier filtro que cambie
  useEffect(() => {
    const sinFiltros = !name.trim() && !status && !type.trim() && !gender
    if (sinFiltros) {
      setResults([])
      setErrorMsg('')
      setHasSearched(false)
      return
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true)
      setErrorMsg('')
      setHasSearched(true)
      try {
        const data = await searchCharacters({
          name: name.trim() || undefined,
          status: status || undefined,
          type: type.trim() || undefined,
          gender: gender || undefined,
        })
        setResults(data)
      } catch (err) {
        setErrorMsg('Error al conectar con la API')
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [name, status, type, gender])

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
          <IoSearch size={36} className="inline-block" /> Búsqueda de Personajes
        </h1>
        <p className="text-white/70 mb-8">Filtra en tiempo real — sin recargar la página</p>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-white text-sm font-semibold block mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ej: rick"
              className="w-full bg-white/90 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="text-white text-sm font-semibold block mb-1">Estado</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-white/90 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">Todos</option>
              <option value="alive">Alive</option>
              <option value="dead">Dead</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>

          <div>
            <label className="text-white text-sm font-semibold block mb-1">Tipo</label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="ej: parasite"
              className="w-full bg-white/90 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="text-white text-sm font-semibold block mb-1">Género</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-white/90 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">Todos</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="genderless">Genderless</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
        </div>

        {loading && <p className="text-center text-white/80">Buscando...</p>}

        {!loading && errorMsg && (
          <p className="text-center text-red-300 flex items-center justify-center gap-2">
            <IoWarning /> {errorMsg}
          </p>
        )}

        {!loading && !errorMsg && hasSearched && results.length === 0 && (
          <p className="text-center text-white/60">No se encontraron personajes con esos filtros.</p>
        )}

        {!loading && !hasSearched && (
          <p className="text-center text-white/50">Escribe un filtro para empezar a buscar.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {results.map((character) => (
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
                      {character.status} · {character.gender}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}