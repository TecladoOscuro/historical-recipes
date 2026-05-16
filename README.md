# Banquetes del Pasado 🏛️🍷

**Recetas históricas curiosas — desde la Prehistoria hasta la era espacial.**

Una PWA para iPhone con 38 recetas de comidas fascinantes de la historia de la humanidad. Desde la última cena de Ötzi el Hombre de Hielo (3300 a.C.) hasta el menú de un astronauta en la Estación Espacial Internacional.

Cada receta incluye:
- 🛒 **Lista de ingredientes** con modo compra (checklist)
- 🔥 **Preparación** paso a paso con tiempos y consejos del chef histórico
- 📖 **El Contexto**: la historia completa del momento, el personaje o el evento, narrado con detalle

### Algunas recetas incluidas

| Receta | Era | Año |
|---|---|---|
| Última cena de Ötzi | Prehistoria | 3300 a.C. |
| Kanasu Stew de Hammurabi | Antiguo | 1750 a.C. |
| Panceta dorada de Calígula | Roma Imperial | 37 d.C. |
| Savillum (cheesecake romana) | Antiguo | Siglo II a.C. |
| Cena de 10 platos del Titanic | Moderno | 1912 |
| Key Lime Pie | Moderno | 1930s |
| Water Pie de la Gran Depresión | Moderno | 1930s |
| Stamppot de bulbos de tulipán | WWII | 1944 |
| Menú de astronauta en la ISS | Era espacial | 2000-presente |

## URL

🔗 **[tecladooscuro.github.io/historical-recipes](https://tecladooscuro.github.io/historical-recipes/)**

## Tech Stack

- React 19 + TypeScript + Vite 8
- Tailwind CSS v4 (tema oro/papiro)
- Dexie.js (IndexedDB para lista de compra)
- PWA (vite-plugin-pwa, modo standalone)
- HashRouter (compatible con GitHub Pages)

## Instalación

```bash
npm install
npm run dev     # desarrollo
npm run build   # producción
```

## Uso en iPhone

Abre la URL en Safari, pulsa **Compartir → Añadir a pantalla de inicio**.
La app se instala como una app nativa (sin barra de navegación, pantalla completa).
