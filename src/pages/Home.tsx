import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { recipes, getDifficultyColor } from '../data/recipes'

const allTags = [
  { key: 'prehistorico', label: '🦴 Prehistoria' },
  { key: 'antiguo', label: '🏛️ Antiguo' },
  { key: 'medieval', label: '⚔️ Medieval' },
  { key: 'moderno', label: '🏭 Moderno' },
  { key: 'realeza', label: '👑 Realeza' },
  { key: 'ultima-cena', label: '⚰️ Última Cena' },
  { key: 'titanic', label: '🚢 Titanic' },
  { key: 'politico', label: '🗳️ Dirigentes' },
  { key: 'belico', label: '⚔️ Guerra' },
  { key: 'espacio', label: '🚀 Espacio' },
  { key: 'depresion', label: '📉 Gran Depresión' },
  { key: 'carne', label: '🍖 Carne' },
  { key: 'postre', label: '🍰 Postre' },
  { key: 'sopa', label: '🍜 Sopa/Guiso' },
  { key: 'bebida', label: '🥤 Bebida' },
  { key: 'vegetariano', label: '🌿 Vegetariano' },
  { key: 'europa', label: '🇪🇺 Europa' },
  { key: 'america', label: '🇺🇸 América' },
  { key: 'asia', label: '🌏 Asia/Oceanía' },
  { key: 'africa', label: '🇪🇬 África/Oriente' },
  { key: 'documentado', label: '📜 Documentado' },
  { key: 'legendario', label: '📖 Legendario' },
]

export function Home() {
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return recipes.filter((r) => {
      if (activeFilters.length && !activeFilters.some((f) => r.tags.includes(f))) return false
      if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.subtitle.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [activeFilters, search])

  const toggleFilter = (key: string) => {
    setActiveFilters((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    )
  }

  return (
    <div className="bg-bp-bg text-bp-text min-h-dvh">
      <div className="sticky top-0 z-20 bg-bp-bg pt-[env(safe-area-inset-top,0px)]">
        <div className="flex items-center justify-between h-12 px-5 border-b border-bp-border">
          <h1 className="text-lg font-bold">🏛️🍷 Banquetes del Pasado</h1>
          <span className="text-xs text-bp-muted bg-bp-surface rounded-full px-2.5 py-1">
            {filtered.length}/{recipes.length}
          </span>
        </div>
        <div className="border-b border-bp-border">
          <div className="px-4 py-2">
            <input
              type="text"
              placeholder="Buscar receta..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-bp-surface border border-bp-border rounded-lg px-3 py-1.5 text-sm text-bp-text placeholder-bp-muted focus:outline-none focus:border-bp-accent"
            />
          </div>
          <div className="flex gap-1.5 px-4 pb-2 overflow-x-auto no-scrollbar">
            {allTags.map((tag) => (
              <button
                key={tag.key}
                onClick={() => toggleFilter(tag.key)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${activeFilters.includes(tag.key) ? 'bg-bp-accent text-white' : 'bg-bp-surface text-bp-muted'}`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pb-8 px-4">
        <div className="space-y-3">
          {filtered.map((recipe) => {
            const diffColor = getDifficultyColor(recipe.difficulty)
            return (
              <Link
                key={recipe.id}
                to={`/receta/${recipe.id}`}
                className="block bg-bp-card rounded-2xl border border-bp-border p-4 active:scale-[0.98] transition-transform duration-100"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium rounded-md px-2 py-0.5 ${diffColor}`}>
                        {recipe.difficulty}
                      </span>
                      <span className="text-[11px] text-bp-muted">{recipe.era} · {recipe.year}</span>
                    </div>
                    <h2 className="text-base font-semibold leading-snug">{recipe.name}</h2>
                    <p className="text-xs text-bp-muted mt-0.5 leading-snug">{recipe.subtitle}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {recipe.tags.slice(0, 3).map((tag) => {
                        const tagObj = allTags.find((t) => t.key === tag)
                        return (
                          <span key={tag} className="text-[10px] text-bp-muted bg-bp-surface rounded px-1.5 py-0.5">{tagObj?.label ?? tag}</span>
                        )
                      })}
                      {recipe.tags.length > 3 && (
                        <span className="text-[10px] text-bp-muted">+{recipe.tags.length - 3}</span>
                      )}
                    </div>
                    <p className="text-sm text-bp-muted mt-1.5 line-clamp-2 leading-relaxed">{recipe.description}</p>
                    <div className="flex items-center gap-3 mt-2.5">
                      <span className="text-xs text-bp-muted">⏱ {recipe.totalTime}</span>
                      <span className="text-xs text-bp-muted">🍽 {recipe.servings}</span>
                      <span className="text-xs text-bp-muted">{recipe.kcal}</span>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-bp-border mt-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            )
          })}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-bp-muted">
              <p className="text-lg">🍽️</p>
              <p className="text-sm mt-2">No hay recetas con esos filtros</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
