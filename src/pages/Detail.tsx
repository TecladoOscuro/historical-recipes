import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getRecipeById, getDifficultyColor } from '../data/recipes'
import { getShoppingList, toggleIngredient, clearShoppingList, checkAll } from '../db/shopping'

const categoryLabels: Record<string, string> = {
  entrante: 'Entrante',
  principal: 'Plato Principal',
  guarnicion: 'Guarnición',
  bebida: 'Bebida',
  postre: 'Postre',
  verdura: 'Verduras',
  pan: 'Pan',
  salsas: 'Salsas',
  condimentos: 'Condimentos',
  especial: 'Especial',
}

const tabs = [
  { key: 'ingredientes', label: '🛒 Ingredientes' },
  { key: 'preparacion', label: '🔥 Preparación' },
  { key: 'contexto', label: '📖 El Contexto' },
] as const

type Tab = (typeof tabs)[number]['key']

export function Detail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const recipe = getRecipeById(id ?? '')

  const [activeTab, setActiveTab] = useState<Tab>('ingredientes')
  const [shoppingMode, setShoppingMode] = useState(false)
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (recipe) {
      getShoppingList(recipe.id).then(setCheckedItems)
    }
  }, [recipe])

  const handleToggle = useCallback(
    async (ingredientId: string) => {
      if (!recipe) return
      const items = await toggleIngredient(recipe.id, ingredientId)
      setCheckedItems(items)
    },
    [recipe]
  )

  const handleClear = useCallback(async () => {
    if (!recipe) return
    await clearShoppingList(recipe.id)
    setCheckedItems({})
  }, [recipe])

  const handleCheckAll = useCallback(async () => {
    if (!recipe) return
    const items = await checkAll(
      recipe.id,
      recipe.ingredients.map((i) => i.id)
    )
    setCheckedItems(items)
  }, [recipe])

  if (!recipe) {
    return (
      <div className="min-h-screen bg-bp-bg text-bp-text flex items-center justify-center">
        <div className="text-center">
          <p className="text-3xl mb-3">🏺</p>
          <p className="text-lg font-semibold">Receta no encontrada</p>
          <p className="text-sm text-bp-muted mt-1">Esta página del pasado se ha perdido</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-bp-accent text-white rounded-lg text-sm"
          >
            Volver al recetario
          </button>
        </div>
      </div>
    )
  }

  const diffColor = getDifficultyColor(recipe.difficulty)

  const groupedIngredients = recipe.ingredients.reduce(
    (acc, ing) => {
      const cat = ing.category
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(ing)
      return acc
    },
    {} as Record<string, typeof recipe.ingredients>
  )

  const totalChecked = Object.values(checkedItems).filter(Boolean).length
  const totalItems = recipe.ingredients.length
  const progress = totalItems > 0 ? Math.round((totalChecked / totalItems) * 100) : 0

  return (
    <div className="min-h-screen bg-bp-bg text-bp-text pb-20">
      <nav className="sticky top-0 z-20 bg-bp-bg/95 backdrop-blur-sm border-b border-bp-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => navigate('/')}
            className="p-1 -ml-1 text-bp-text hover:text-bp-accent transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-white truncate">{recipe.name}</h2>
            <p className="text-[11px] text-bp-muted truncate">{recipe.era} · {recipe.year} · {recipe.place}</p>
          </div>
        </div>

        <div className="flex border-b border-bp-border">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                activeTab === tab.key
                  ? 'text-bp-accent border-b-2 border-bp-accent'
                  : 'text-bp-muted hover:text-bp-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="px-4 py-4">
        <div className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-3 ${diffColor}`}>
          {recipe.difficulty}
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-bp-muted mb-3">
          <span>⏱ {recipe.totalTime}</span>
          <span>👤 {recipe.servings}</span>
          <span>🔥 {recipe.kcal}</span>
          <span>📅 {recipe.era}</span>
          <span>📍 {recipe.place}</span>
        </div>

        <p className="text-sm text-bp-text/90 mb-2 leading-relaxed">{recipe.description}</p>
        <p className="text-xs text-bp-muted italic leading-relaxed">{recipe.story}</p>
      </div>

      {activeTab === 'ingredientes' && (
        <div className="px-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-bp-muted">
                {shoppingMode ? 'Modo compra' : 'Lista'}
              </span>
              <button
                onClick={() => setShoppingMode(!shoppingMode)}
                className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                  shoppingMode
                    ? 'bg-bp-accent text-white'
                    : 'bg-bp-surface text-bp-text border border-bp-border'
                }`}
              >
                {shoppingMode ? '✓ Modo lista' : '☐ Modo compra'}
              </button>
            </div>
            {shoppingMode && (
              <div className="flex gap-2">
                <button
                  onClick={handleCheckAll}
                  className="text-xs px-2 py-1 bg-bp-surface text-bp-accent rounded border border-bp-border"
                >
                  Todo ✓
                </button>
                <button
                  onClick={handleClear}
                  className="text-xs px-2 py-1 bg-bp-surface text-red-400 rounded border border-bp-border"
                >
                  Borrar
                </button>
              </div>
            )}
          </div>

          {shoppingMode && totalItems > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-bp-muted">{totalChecked}/{totalItems} ingredientes</span>
                <span className="text-bp-accent">{progress}%</span>
              </div>
              <div className="h-1.5 bg-bp-surface rounded-full overflow-hidden">
                <div
                  className="h-full bg-bp-green rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="space-y-4">
            {Object.entries(groupedIngredients).map(([category, ingredients]) => (
              <div key={category}>
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-bp-accent mb-2">
                  {categoryLabels[category] ?? category}
                </h4>
                <div className="space-y-1">
                  {ingredients.map((ing) => {
                    const checked = !!checkedItems[ing.id]
                    return (
                      <button
                        key={ing.id}
                        onClick={() => shoppingMode && handleToggle(ing.id)}
                        className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          shoppingMode ? 'cursor-pointer hover:bg-bp-surface' : ''
                        } ${checked ? 'opacity-50' : ''}`}
                      >
                        {shoppingMode && (
                          <span
                            className={`shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center text-xs transition-colors ${
                              checked
                                ? 'bg-bp-green border-bp-green text-white'
                                : 'border-bp-border'
                            }`}
                          >
                            {checked && '✓'}
                          </span>
                        )}
                        <span className={`text-sm ${checked ? 'line-through text-bp-muted' : 'text-bp-text'}`}>
                          {ing.name}
                        </span>
                        <span className="text-xs text-bp-muted ml-auto shrink-0">{ing.quantity}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'preparacion' && (
        <div className="px-4">
          <div className="space-y-5">
            {recipe.prepSteps.map((step) => (
              <div key={step.order} className="flex gap-3">
                <div className="shrink-0 w-7 h-7 rounded-full bg-bp-accent text-white flex items-center justify-center text-xs font-bold">
                  {step.order}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-bp-text leading-relaxed">{step.description}</p>
                  {(step.time || step.heatLevel) && (
                    <div className="flex gap-3 mt-1 text-[10px] text-bp-muted">
                      {step.time && <span>⏱ {step.time}</span>}
                      {step.heatLevel && <span>🔥 {step.heatLevel}</span>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {recipe.chefTips.length > 0 && (
            <div className="mt-6 p-4 bg-bp-surface rounded-xl border border-bp-border">
              <h4 className="text-sm font-semibold text-bp-accent mb-3">💡 Consejos del chef histórico</h4>
              <div className="space-y-2">
                {recipe.chefTips.map((tip, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-bp-accent shrink-0 mt-0.5 text-xs">✦</span>
                    <p className="text-xs text-bp-text/80 leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'contexto' && (
        <div className="px-4">
          <h3 className="text-lg font-bold text-white mb-4">{recipe.contextTitle}</h3>
          <div className="bg-bp-surface rounded-xl border border-bp-border p-4">
            <p className="text-sm text-bp-text leading-relaxed whitespace-pre-line">{recipe.context}</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-[10px] text-bp-muted">
            <span className="bg-bp-card px-2 py-1 rounded border border-bp-border">📅 {recipe.era}</span>
            <span className="bg-bp-card px-2 py-1 rounded border border-bp-border">🕰 {recipe.year}</span>
            <span className="bg-bp-card px-2 py-1 rounded border border-bp-border">📍 {recipe.place}</span>
          </div>
        </div>
      )}
    </div>
  )
}
