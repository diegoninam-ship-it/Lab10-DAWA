import { Character, CharacterListResponse, CharacterSearchParams } from "@/types/rickandmorty";

const BASE_URL = "https://rickandmortyapi.com/api/character";
const TEN_DAYS = 864000;

// Reintenta una petición fetch ante fallos temporales (rate limiting, timeouts)
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries: number = 3,
  delayMs: number = 800
): Promise<Response> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetch(url, options);

    // 404 no se reintenta: el recurso simplemente no existe
    if (res.status === 404) return res;

    if (res.ok) return res;

    // Si fue el último intento, devolvemos la respuesta fallida tal cual
    if (attempt === retries) return res;

    // Espera antes de reintentar, con backoff exponencial (500ms, 1000ms, 2000ms...)
    await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
  }

  // TypeScript exige un retorno fuera del for, aunque este punto nunca se alcanza
  throw new Error("No se pudo completar la petición");
}

export async function getCharacters(page: number = 1): Promise<CharacterListResponse> {
  const res = await fetchWithRetry(`${BASE_URL}?page=${page}`, { cache: "force-cache" });

  if (!res.ok) throw new Error("Error al cargar personajes");
  return res.json();
}

export async function getCharacterById(id: string): Promise<Character | null> {
  const res = await fetchWithRetry(`${BASE_URL}/${id}`, { next: { revalidate: TEN_DAYS } });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Error al conectar con la API de Rick and Morty");

  return res.json();
}

export async function searchCharacters(params: CharacterSearchParams): Promise<Character[]> {
  const query = new URLSearchParams();
  if (params.name) query.append("name", params.name);
  if (params.status) query.append("status", params.status);
  if (params.type) query.append("type", params.type);
  if (params.gender) query.append("gender", params.gender);

  const res = await fetchWithRetry(`${BASE_URL}?${query.toString()}`);

  if (res.status === 404) return [];
  if (!res.ok) throw new Error("Error al buscar personajes");

  const data: CharacterListResponse = await res.json();
  return data.results;
}

export async function getAllCharacterIds(limit: number = 100): Promise<string[]> {
  const perPage = 20;
  const pagesNeeded = Math.ceil(limit / perPage);

  const pageRequests = Array.from({ length: pagesNeeded }, (_, i) =>
    getCharacters(i + 1)
  );
  const pages = await Promise.all(pageRequests);

  const allResults = pages.flatMap((page) => page.results);
  return allResults.slice(0, limit).map((character) => character.id.toString());
}