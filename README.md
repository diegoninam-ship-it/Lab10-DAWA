<div align="center">

# 🧩 Laboratorio 10 — Desarrollo de Aplicaciones Web Avanzado

### Enrutamiento y Páginas — SSG, ISR y rutas dinámicas con Next.js

![Next.js](https://img.shields.io/badge/Next.js-16.4.3-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Status](https://img.shields.io/badge/status-completado-brightgreen?style=for-the-badge)

*Tecsup · Diseño y Desarrollo de Software · 5 - C24 - Sección A-B*

</div>

---

## 📖 Tabla de contenidos

- [Descripción general](#-descripción-general)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Ejercicio guiado — Pokédex (ISR + SSG)](#-ejercicio-guiado--pokédex-isr--ssg)
- [Tarea — Rick and Morty](#-tarea--rick-and-morty)
- [Justificación SSG vs ISR](#-justificación-ssg-vs-isr)
- [Cómo ejecutar el proyecto](#-cómo-ejecutar-el-proyecto)
- [Despliegue](#-despliegue)
- [Stack técnico](#-stack-técnico)
- [Autor](#-autor)

---

## 📌 Descripción general

Proyecto Next.js (App Router) enfocado en estrategias de generación de páginas: **SSG** (Static Site Generation), **ISR** (Incremental Static Regeneration) y rutas dinámicas con `generateStaticParams`. Incluye un Pokédex guiado consumiendo PokéAPI, y una aplicación de personajes de Rick and Morty con búsqueda en tiempo real (CSR).

---

## 🗂 Estructura del proyecto

```
next-ssg-isr-app/
├── src/
│   ├── app/
│   │   ├── page.tsx                      # Home — enlaza a ambas secciones
│   │   │
│   │   ├── pokemon/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                    # Lista (ISR, revalidate 24h)
│   │   │   ├── error.tsx
│   │   │   ├── not-found.tsx
│   │   │   └── [name]/
│   │   │       └── page.tsx                 # Detalle (SSG + ISR, 151 rutas)
│   │   │
│   │   └── characters/
│   │       ├── layout.tsx
│   │       ├── page.tsx                    # Lista con paginación (SSG forzado)
│   │       ├── error.tsx
│   │       ├── not-found.tsx
│   │       ├── search/
│   │       │   └── page.tsx                 # Búsqueda (CSR)
│   │       └── [id]/
│   │           └── page.tsx                 # Detalle (SSG parcial + ISR, 40 rutas + bajo demanda)
│   │
│   ├── lib/
│   │   └── rickandmorty.ts                 # Funciones centralizadas + reintentos
│   │
│   └── types/
│       ├── pokemon.ts
│       └── rickandmorty.ts
│
└── next.config.ts                          # remotePatterns + experimental.cpus
```

---

## 🐾 Ejercicio guiado — Pokédex (ISR + SSG)

| Ruta | Estrategia | Detalle |
|---|---|---|
| `/pokemon` | ISR | `next: { revalidate: 86400 }` — revalida cada 24h |
| `/pokemon/[name]` | SSG + ISR | `generateStaticParams` pre-genera las 151 rutas; se revalidan cada 24h |

Incluye manejo de errores (`error.tsx`) y de rutas inexistentes (`not-found.tsx`, disparado con `notFound()`).

---

## 🛸 Tarea — Rick and Morty

<details open>
<summary>📋 <b>Requisitos implementados</b></summary>
<br>

| Requisito | Implementación |
|---|---|
| Página principal (SSR/SSG forzado) | `/characters` — `cache: "force-cache"`, con paginación (`?page=N`) |
| Lazy loading de imágenes | `next/image` con `priority={false}` |
| Búsqueda en tiempo real (CSR) | `/characters/search` — `useState` + `useEffect` con debounce (500ms) |
| Filtros | Por `name`, `status`, `type` y `gender`, combinables |
| Detalle de personaje | `/characters/[id]` — todos los campos del Response mapeados |
| Rutas estáticas | `generateStaticParams` pre-genera un subconjunto (40 personajes); el resto se genera bajo demanda y se cachea |
| Revalidación | `next: { revalidate: 864000 }` — cada 10 días (ISR) |

</details>

<details>
<summary>⚙️ <b>Nota técnica — subconjunto en <code>generateStaticParams</code></b></summary>
<br>

La API tiene ~826 personajes repartidos en 42 páginas. Pre-generar todas en el build satura la API externa con peticiones paralelas (rate limiting). Se optó por pre-generar un subconjunto (40) y dejar que Next.js genere el resto **bajo demanda** en su primera visita, cacheándolas igual que las estáticas — comportamiento estándar (`dynamicParams: true`) recomendado por Next.js para catálogos grandes. Se añadió además un mecanismo de reintento con backoff (`fetchWithRetry`) para tolerar fallos transitorios de la API durante el build.

</details>

---

## ⚖️ Justificación SSG vs ISR

- **`/pokemon` y `/characters` (listas) → SSG / caché forzado:** el contenido no depende del usuario, y mostrarlo ya pre-generado da una carga inicial instantánea.
- **`/pokemon/[name]` y `/characters/[id]` (detalle) → SSG + ISR:** se pre-generan como estáticas, pero se revalidan periódicamente (24h y 10 días respectivamente) para reflejar cambios en la API sin requerir un nuevo despliegue manual.
- **`/characters/search` → CSR:** depende enteramente de la interacción del usuario en tiempo real; no hay nada que precalcular de antemano.

---

## ▶️ Cómo ejecutar el proyecto

```bash
git clone https://github.com/diegoninam-ship-it/Lab10-DAWA.git
cd Lab10-DAWA
npm install
npm run dev
```

Visita `http://localhost:3000`.

---

## 🚀 Despliegue

```bash
npm run build
npm start
```

**Producción:** [Lab10-DAWA en Vercel](https://lab10-dawa-mu.vercel.app/) <!-- reemplazar con el link real -->

---

## 🧰 Stack técnico

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white)

</div>

---

## 👤 Autor

**Diego Nina Malqui** — Estudiante de Diseño y Desarrollo de Software, Tecsup
📍 Laboratorio 10 · Desarrollo de Aplicaciones Web Avanzado

<div align="center">

⭐ *Si este repo te sirvió de guía, no olvides dejar una estrella* ⭐

</div>