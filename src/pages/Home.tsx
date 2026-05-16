import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
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
    <div className="min-h-screen bg-bp-bg text-bp-text pb-20">
      <header className="sticky top-0 z-20 bg-bp-bg/95 backdrop-blur-sm border-b border-bp-border">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-center">🏛️🍷 Banquetes del Pasado</h1>
          <p className="text-xs text-bp-muted text-center mt-1">Recetas históricas que marcaron época</p>
        </div>
        <div className="px-4 pb-3">
          <input
            type="text"
            placeholder="Buscar receta..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-bp-surface border border-bp-border rounded-lg px-3 py-2 text-sm text-bp-text placeholder-bp-muted focus:outline-none focus:border-bp-accent"
          />
        </div>
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
          {allTags.map((tag) => (
            <button
              key={tag.key}
              onClick={() => toggleFilter(tag.key)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeFilters.includes(tag.key)
                  ? 'bg-bp-accent text-white'
                  : 'bg-bp-surface text-bp-text border border-bp-border hover:border-bp-accent'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
        <div className="px-4 pb-3">
          <span className="text-xs text-bp-muted">
            {filtered.length}/{recipes.length} recetas
          </span>
        </div>
      </header>

      <div className="px-4 pt-4 space-y-3">
        {filtered.map((recipe) => {
          const diffColor = getDifficultyColor(recipe.difficulty)
          return (
            <button
              key={recipe.id}
              onClick={() => navigate(`/receta/${recipe.id}`)}
              className="w-full text-left bg-bp-card border border-bp-border rounded-xl p-4 hover:border-bp-accent transition-colors active:scale-[0.98]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${diffColor}`}>
                      {recipe.difficulty}
                    </span>
                    <span className="text-[10px] text-bp-muted">
                      {recipe.era} · {recipe.year}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-white truncate">{recipe.name}</h3>
                  <p className="text-xs text-bp-muted mt-0.5 truncate">{recipe.subtitle}</p>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {recipe.tags.slice(0, 3).map((tag) => {
                      const tagObj = allTags.find((t) => t.key === tag)
                      return (
                        <span key={tag} className="text-[10px] bg-bp-surface px-1.5 py-0.5 rounded text-bp-text/70">
                          {tagObj?.label ?? tag}
                        </span>
                      )
                    })}
                    {recipe.tags.length > 3 && (
                      <span className="text-[10px] text-bp-muted">+{recipe.tags.length - 3}</span>
                    )}
                  </div>
                  <p className="text-xs text-bp-text/80 mt-2 line-clamp-2">{recipe.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-bp-muted">
                    <span>⏱ {recipe.totalTime}</span>
                    <span>👤 {recipe.servings}</span>
                    <span>🔥 {recipe.kcal}</span>
                  </div>
                </div>
                <svg className="w-5 h-5 text-bp-muted shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
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
  )
}
