# PAI — Prácticas de Programación de Aplicaciones Interactivas

**Álvaro Pérez Ramos** — `alu0101574042@ull.edu.es`  
Universidad de La Laguna · ESIT · Grado en Ingeniería Informática  
Programación de Aplicaciones Interactivas — Curso 2025–26

---

## Índice

- [PAI — Prácticas de Programación de Aplicaciones Interactivas](#pai--prácticas-de-programación-de-aplicaciones-interactivas)
  - [Índice](#índice)
  - [Descripción del repositorio](#descripción-del-repositorio)
  - [Estructura de directorios](#estructura-de-directorios)
  - [Práctica 12 — El Ahorcado](#práctica-12--el-ahorcado)
    - [Objetivo](#objetivo)
    - [Descripción del juego](#descripción-del-juego)
    - [Arquitectura MVC](#arquitectura-mvc)
    - [Clases e interfaces](#clases-e-interfaces)
      - [Interfaces y tipos (`interfaces/game-state.ts`)](#interfaces-y-tipos-interfacesgame-statets)
      - [Interfaces de configuración (`interfaces/render-config.ts`)](#interfaces-de-configuración-interfacesrender-configts)
      - [Fuentes de palabras (`data/categories/`)](#fuentes-de-palabras-datacategories)
      - [Módulo de palabras (`data/word-dictionary.ts`)](#módulo-de-palabras-dataword-dictionaryts)
      - [Clases del sistema MVC](#clases-del-sistema-mvc)
    - [Flujo de ejecución](#flujo-de-ejecución)
    - [Patrones de diseño](#patrones-de-diseño)
    - [Principios SOLID](#principios-solid)
    - [Diagrama UML](#diagrama-uml)
  - [CI/CD con GitHub Actions](#cicd-con-github-actions)
    - [Diseño del pipeline](#diseño-del-pipeline)
    - [Jobs del pipeline](#jobs-del-pipeline)
    - [Permisos necesarios](#permisos-necesarios)
  - [Configuración del proyecto](#configuración-del-proyecto)
  - [Instalación y ejecución](#instalación-y-ejecución)
  - [Scripts disponibles](#scripts-disponibles)
  - [URLs de la aplicación](#urls-de-la-aplicación)
  - [Tecnologías y herramientas](#tecnologías-y-herramientas)
  - [Referencias](#referencias)
  - [Licencia](#licencia)

---

## Descripción del repositorio

Este repositorio recoge el trabajo realizado para la asignatura
**Programación de Aplicaciones Interactivas (PAI)** del Grado en
Ingeniería Informática de la Universidad de La Laguna.

El código fuente se organiza bajo `src/exercises/` con una entrada por
práctica. Cada práctica incluye la aplicación, su documentación TypeDoc,
el diagrama UML en Mermaid y, cuando aplica, el ejercicio de la sesión
de evaluación. La raíz del repositorio sirve como página índice que
enlaza a todos los recursos.

---

## Estructura de directorios

```text
25-26-pai-p12-hangman-ghpages-AlvaroPerezRamos/
│
├── index.html                          ← Página índice (raíz del servidor)
├── package.json                        ← Dependencias y scripts npm
├── package-lock.json
├── eslint.config.mjs                   ← Configuración ESLint
├── vite.config.ts                      ← Configuración Vite (base URL, entradas)
├── LICENSE
├── README.md
│
├── public/
│   └── images/
│       └── hangman/                    ← Hangman-0.png … Hangman-6.png
│
├── scripts/
│   └── dev-server.js                   ← Servidor Express con livereload
│
├── dist/                               ← Bundle de producción (generado; no editar)
│
└── src/
    └── exercises/
        ├── evaluation-exercise1-title/
        │   └── alvaro-perez-ramos-evaluation.html
        │
        └── home-work/
            ├── docs/                                ← Documentación TypeDoc (generada; no editar)
            │
            ├── hangman/
            │   ├── alvaro-perez-ramos-hangman.html  ← SPA del juego
            │   ├── hangman-client.ts                ← Punto de entrada: instancia M, V y C
            │   │
            │   ├── data/
            │   │   ├── word-dictionary.ts           ← Registro de categorías + getRandomWordEntry()
            │   │   └── categories/
            │   │       ├── animals-source.ts        ← AnimalsSource extends WordCategory
            │   │       ├── countries-source.ts      ← CountriesSource extends WordCategory
            │   │       ├── food-drink-source.ts     ← FoodDrinkSource extends WordCategory
            │   │       ├── brands-source.ts         ← BrandsSource extends WordCategory
            │   │       └── videogames-source.ts     ← VideogamesSource extends WordCategory
            │   │
            │   ├── interfaces/
            │   │   ├── game-state.ts                ← WordEntry, WordProvider, WordCategory (abstracta),
            │   │   │                                   LetterHitData, LetterMissData, GameOverData, NewGameData
            │   │   └── render-config.ts             ← RenderConfig + DEFAULT_RENDER_CONFIG
            │   │
            │   ├── observer/
            │   │   └── event.ts                     ← Clase genérica Event<T> — patrón Observer
            │   │
            │   ├── model/
            │   │   └── hangman-model.ts             ← Lógica del juego + emisión de eventos
            │   │
            │   ├── view/
            │   │   ├── hangman-view.ts              ← Vista principal (Facade)
            │   │   ├── game-panel-view.ts           ← Casillas, contador, letras falladas
            │   │   └── hangman-render/
            │   │       ├── hangman-renderer.ts      ← Clase abstracta: contrato de todo renderer
            │   │       ├── hangman-canvas-renderer.ts ← Implementación con Canvas API
            │   │       └── hangman-image-renderer.ts  ← Implementación con imágenes PNG + fallback canvas
            │   │
            │   └── controller/
            │       ├── hangman-controller.ts        ← Conecta modelo ↔ vista vía eventos
            │       └── letter-keyboard.ts           ← Botones del alfabeto; emite letterPressEvent
            │
            └── uml/
                ├── hangman.mmd                      ← Fuente del diagrama de clases (Mermaid)
                ├── uml.html                         ← Página que renderiza el diagrama
                └── uml.ts                           ← Lógica de carga del diagrama
```

---

## Práctica 12 — El Ahorcado

### Objetivo

Aplicar programación gráfica con la **Canvas API**, el patrón **MVC**,
los principios **SOLID** y los patrones **Observer**, **Facade**, **Template Method**
y **Strategy** en un juego interactivo de escritorio.

### Descripción del juego

El jugador debe adivinar una palabra perteneciente a una de las cinco
categorías disponibles (Animales, Países, Comida y Bebida, Marcas y
Empresas, Videojuegos), letra a letra, antes de que se complete el
dibujo del ahorcado. Se permiten **6 fallos** como máximo. Al cargar
la página el juego ya está inicializado y listo para jugar. Se puede
interactuar tanto con el teclado físico como con el teclado virtual de
la interfaz.

La categoría se elige de forma aleatoria en cada partida y se muestra
al jugador junto con las casillas de la palabra. Las palabras compuestas
(con espacios o guiones) se representan con celdas de distinto tipo para
que el jugador pueda ver la separación sin revelar las letras.

La interfaz se divide en dos mitades:

- **Izquierda**: muestra el estado del ahorcado. Por defecto usa
  `HangmanImageRenderer` (imágenes PNG `Hangman-0.png` … `Hangman-6.png`);
  si alguna imagen no carga, hace fallback automático al `HangmanCanvasRenderer`
  que dibuja el patíbulo con la Canvas API.
- **Derecha**: panel de juego con las casillas de la palabra, la etiqueta
  de categoría, el contador de intentos restantes, las letras falladas, el
  teclado virtual de 27 letras (alfabeto español con ñ) y el botón «Nueva partida».

### Arquitectura MVC

La comunicación entre capas se realiza **exclusivamente mediante eventos**
(patrón Observer implementado en `Event<T>`). El modelo nunca referencia
la vista ni el DOM.

```
hangman-client.ts               ← main(): instancia M, V y C
  └── HangmanController         ← Registra listeners; arranca la partida
        ├── HangmanModel        ← Lógica del juego; emite cuatro eventos tipados
        └── HangmanView         ← Facade: coordina renderer, panel y teclado
              ├── HangmanImageRenderer    ← Muestra PNG; hace fallback a canvas
              │     └── HangmanCanvasRenderer  ← Dibuja patíbulo con Canvas API
              ├── GamePanelView           ← Casillas, contador, letras falladas, mensaje
              └── LetterKeyboard          ← Botones; emite letterPressEvent
```

**Flujo de datos — turno normal:**

```
[Usuario pulsa tecla física / botón del teclado virtual]
                    │
                    ▼
   LetterKeyboard.letterPressEvent  /  document keydown
                    │
                    ▼
           HangmanController  →  HangmanModel.play(letter)
                    │
                    ├─ letra acertada ──► letterHitEvent  ──► HangmanView.onLetterHit()
                    │                                              ├─ GamePanelView.revealLetter(positions)
                    │                                              └─ LetterKeyboard.markCorrect()
                    │
                    ├─ letra fallada  ──► letterMissEvent ──► HangmanView.onLetterMiss()
                    │                                              ├─ renderer.render(failCount)
                    │                                              ├─ GamePanelView.addFailedLetter()
                    │                                              └─ LetterKeyboard.markWrong()
                    │
                    └─ fin de partida ──► gameOverEvent   ──► HangmanView.onGameOver()
                                                               ├─ LetterKeyboard.disableAll()
                                                               └─ GamePanelView.showWin/showLoss()
```

### Clases e interfaces

#### Interfaces y tipos (`interfaces/game-state.ts`)

| Símbolo | Tipo | Descripción |
|---|---|---|
| `WordEntry` | `interface` | Par palabra–categoría devuelto por cualquier proveedor |
| `WordProvider` | `type` | `() => WordEntry`; contrato funcional inyectado en el modelo |
| `WordCategory` | clase abstracta | Base de toda fuente de palabras; define `label` y `getWord()` |
| `LetterHitData` | `interface` | Letra acertada + posiciones en la palabra |
| `LetterMissData` | `interface` | Letra fallada + contador de fallos acumulados |
| `GameOverData` | `interface` | Resultado final (victoria/derrota) + palabra secreta |
| `NewGameData` | `interface` | Longitud, categoría y palabra secreta de la nueva partida |

#### Interfaces de configuración (`interfaces/render-config.ts`)

| Símbolo | Descripción |
|---|---|
| `RenderConfig` | Color de trazo, grosor de línea y padding del canvas |
| `DEFAULT_RENDER_CONFIG` | Constante con los valores por defecto (negro, grosor 4, padding 20) |

#### Fuentes de palabras (`data/categories/`)

Cada fichero exporta un singleton que extiende `WordCategory`. El diccionario
de palabras está encapsulado como miembro privado de cada clase, sin constantes
globales visibles.

| Clase | Fichero | Categoría |
|---|---|---|
| `AnimalsSource` | `animals-source.ts` | Animales |
| `CountriesSource` | `countries-source.ts` | Países |
| `FoodDrinkSource` | `food-drink-source.ts` | Comida y Bebida |
| `BrandsSource` | `brands-source.ts` | Marcas y Empresas |
| `VideogamesSource` | `videogames-source.ts` | Videojuegos |

#### Módulo de palabras (`data/word-dictionary.ts`)

Registra las cinco categorías y expone `getRandomWordEntry()`, que es el
único `WordProvider` inyectado en el modelo. Para añadir una categoría
nueva basta con crear su clase en `categories/` e importar el singleton aquí.

#### Clases del sistema MVC

| Fichero | Clase | Capa | Responsabilidad |
|---|---|---|---|
| `observer/event.ts` | `Event<T>` | Compartida | Patrón Observer genérico y tipado |
| `model/hangman-model.ts` | `HangmanModel` | Modelo | Lógica del juego; emite los cuatro eventos |
| `view/hangman-view.ts` | `HangmanView` | Vista | Facade; un método público por evento del modelo |
| `view/hangman-render/hangman-renderer.ts` | `HangmanRenderer` | Vista | Clase abstracta: contrato `render(failedAttempts)` |
| `view/hangman-render/hangman-image-renderer.ts` | `HangmanImageRenderer` | Vista | Muestra PNG del estado; delega en canvas si falla la carga |
| `view/hangman-render/hangman-canvas-renderer.ts` | `HangmanCanvasRenderer` | Vista | Dibuja patíbulo y cuerpo con Canvas API |
| `view/game-panel-view.ts` | `GamePanelView` | Vista | Casillas de palabra, contador, letras falladas y mensaje final |
| `controller/letter-keyboard.ts` | `LetterKeyboard` | Vista/Ctrl | Teclado virtual de 27 letras; emite `letterPressEvent` |
| `controller/hangman-controller.ts` | `HangmanController` | Controlador | Conecta modelo ↔ vista; gestiona teclado físico |

### Flujo de ejecución

```
main() [hangman-client.ts]
  │
  ├─ new HangmanModel(getRandomWordEntry)
  │     └─ startNewGame()
  │           ├─ wordProvider() → {word, category}
  │           └─ newGameEvent.trigger({wordLength, category, word})
  │
  ├─ new HangmanView()
  │     ├─ new HangmanImageRenderer('hangmanImage', 'hangmanCanvas')
  │     │     └─ (internamente) new HangmanCanvasRenderer(canvas, DEFAULT_RENDER_CONFIG)
  │     ├─ new GamePanelView(wordDisplay, remaining, failed, status, categoryLabel)
  │     └─ new LetterKeyboard(container)
  │
  └─ new HangmanController(model, view)
        └─ run()
              ├─ model.newGameEvent    → view.onNewGame(wordLength, category, word)
              ├─ model.letterHitEvent  → view.onLetterHit(letter, positions)
              ├─ model.letterMissEvent → view.onLetterMiss(letter, failCount)
              ├─ model.gameOverEvent   → view.onGameOver(playerWon, secretWord)
              ├─ view.keyboard.letterPressEvent → model.play(letter)
              ├─ view.newGameEvent     → model.startNewGame()
              └─ document 'keydown'    → model.play(event.key)
```

### Patrones de diseño

| Patrón | Clase(s) implicadas | Dónde exactamente | Propósito |
|---|---|---|---|
| **Observer** | `Event<T>`, `HangmanModel`, `HangmanController`, `LetterKeyboard` | `observer/event.ts`; los cuatro `*Event` del modelo; `letterPressEvent` y `newGameEvent` | El modelo notifica cambios de estado sin acoplar la vista. El controlador suscribe los handlers en `run()` |
| **Facade** | `HangmanView` | `view/hangman-view.ts` | Oculta la composición interna (renderer + panel + teclado) tras cuatro métodos públicos: `onNewGame`, `onLetterHit`, `onLetterMiss`, `onGameOver` |
| **Template Method** | `HangmanCanvasRenderer` | `view/hangman-render/hangman-canvas-renderer.ts` | `render()` define el algoritmo fijo (limpiar → calcular geometría → dibujar patíbulo → dibujar cuerpo); cada parte del cuerpo es un paso delegado |
| **Strategy** | `HangmanRenderer` (abstracta), `HangmanImageRenderer`, `HangmanCanvasRenderer` | `view/hangman-render/` | `HangmanView` depende de la abstracción `HangmanRenderer`; la implementación concreta (imágenes vs. canvas) se puede sustituir sin tocar `HangmanView` |
| **MVC** | `HangmanModel`, `HangmanView`, `HangmanController` | Toda la carpeta `hangman/` | Separa datos (Model), presentación (View) y coordinación (Controller); ninguna capa conoce los detalles internos de otra |

### Principios SOLID

| Principio | Clase(s) | Aplicación concreta |
|---|---|---|
| **S — Single Responsibility** | Todas | `HangmanModel` solo gestiona estado del juego. `HangmanCanvasRenderer` solo dibuja. `GamePanelView` solo gestiona el texto del panel. `LetterKeyboard` solo gestiona los botones. `HangmanController` solo conecta eventos. Cada `*Source` solo encapsula su propio diccionario. |
| **O — Open/Closed** | `WordCategory`, `HangmanRenderer` y sus subclases | Se pueden añadir nuevas categorías extendiendo `WordCategory` y registrándolas en `word-dictionary.ts`. Se pueden añadir nuevos renderers extendiendo `HangmanRenderer`. En ninguno de los dos casos se modifica código existente. |
| **L — Liskov Substitution** | `HangmanRenderer` → `HangmanImageRenderer`, `HangmanCanvasRenderer`; `WordCategory` → todas las fuentes | Cualquier subclase de `HangmanRenderer` o `WordCategory` es sustituible por su base sin romper el contrato. |
| **I — Interface Segregation** | Interfaces de `game-state.ts`, `RenderConfig` | Cada interfaz expone solo los campos que su consumidor necesita; `LetterHitData` no contamina con campos de `GameOverData`, etc. |
| **D — Dependency Inversion** | `HangmanModel`, `HangmanController`, `HangmanView` | `HangmanModel` recibe una `WordProvider` (abstracción funcional) en lugar de depender de ningún módulo de datos concreto. `HangmanView` depende de `HangmanRenderer` (abstracta), no de `HangmanImageRenderer` ni de `HangmanCanvasRenderer`. `HangmanController` recibe modelo y vista por constructor. |

### Diagrama UML

El diagrama de clases en formato Mermaid se encuentra en:

```
src/exercises/home-work/uml/hangman.mmd
```

Se renderiza en la URL de desarrollo:

```
http://localhost:5173/src/exercises/home-work/uml/uml.html
```

---

## CI/CD con GitHub Actions

El pipeline se encuentra en `.github/workflows/ci.yml` y se ejecuta en cada
`push` o `pull_request` a `main`, así como manualmente desde la pestaña
Actions (`workflow_dispatch`).

### Diseño del pipeline

El workflow usa **`peaceiris/actions-gh-pages@v4`** para desplegar en GitHub Pages.
Esta acción hace un push directo a la rama `gh-pages` usando el `GITHUB_TOKEN`
con permiso `contents: write`, lo que funciona en repositorios privados de
organización **sin necesidad de acceder a Settings → Pages** ni de tener
permisos `pages: write` o `id-token: write`.

> **Requisito único (one-time, lo hace el profesor/organización):** en
> *Settings → Pages → Source* seleccionar *«Deploy from a branch»*, rama
> `gh-pages`, carpeta `/ (root)`. Esto solo se hace una vez.

### Jobs del pipeline

```
push/PR a main
      │
      ▼
┌─────────────────────────────────┐
│  static-analysis                │
│  ① checkout                    │
│  ② setup Node.js 20            │
│  ③ npm ci                      │
│  ④ npm run lint:ci  (ESLint)   │
└──────────────┬──────────────────┘
               │ needs: static-analysis
               ▼
┌─────────────────────────────────┐
│  vite-build                     │
│  ① checkout + npm ci           │
│  ② npm run build  (tsc)        │
│  ③ npm run vite:build          │
│  ④ upload-artifact → dist/     │
└──────────────┬──────────────────┘
               │ needs: vite-build
               ▼
┌─────────────────────────────────┐
│  typedoc-generation             │
│  ① checkout + npm ci           │
│  ② npm run build + docs        │
│  ③ upload-artifact → docs/     │
└──────────────┬──────────────────┘
               │ needs: typedoc-generation
               │ solo en push a main
               ▼
┌─────────────────────────────────┐
│  github-pages-deploy            │
│  ① checkout + npm ci           │
│  ② build + vite:build + docs   │
│  ③ peaceiris/actions-gh-pages  │
│     publish_dir: .              │
│     (excluye src, node_modules, │
│      *.ts, *.json, etc.)        │
└─────────────────────────────────┘
```

### Permisos necesarios

El workflow solo necesita este permiso a nivel de repositorio:

```yaml
permissions:
  contents: write   # para que peaceiris pueda hacer push a gh-pages
```

---

## Configuración del proyecto

| Fichero | Propósito |
|---|---|
| `package.json` | Dependencias, scripts y metadatos del proyecto |
| `eslint.config.mjs` | Reglas ESLint (Google TypeScript Style Guide) |
| `vite.config.ts` | Configuración de Vite: base URL y múltiples puntos de entrada |
| `scripts/dev-server.js` | Servidor Express con livereload para desarrollo sin Vite |

**Dependencias de producción:**

| Paquete | Uso |
|---|---|
| `bulma` | Framework CSS |
| `mermaid` | Renderizado del diagrama UML en el navegador |
| `express` | Servidor de desarrollo alternativo |

**Dependencias de desarrollo:**

| Paquete | Uso |
|---|---|
| `typescript` | Compilador TypeScript |
| `vite` | Bundler y servidor de desarrollo |
| `typedoc` | Generación de documentación API |
| `eslint` | Linter |
| `jest` | Tests unitarios |

---

## Instalación y ejecución

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd 25-26-pai-p12-hangman-ghpages-AlvaroPerezRamos

# 2. Instalar dependencias
npm ci

# 3. Arrancar el servidor de desarrollo (con HMR)
npm run dev:vite
# → http://localhost:5173/
```

---

## Scripts disponibles

| Script | Comando | Descripción |
|---|---|---|
| `build` | `tsc` | Compila TypeScript a JavaScript |
| `tsc:watch` | `tsc -w` | Compilación incremental en modo observación |
| `vite:build` | `vite build` | Bundle de producción en `dist/` |
| `dev:vite` | `vite` | Servidor de desarrollo con HMR |
| `dev:server` | `node scripts/dev-server.js` | Servidor Express alternativo con livereload |
| `preview` | `vite preview` | Previsualización del bundle de producción |
| `lint` | `eslint "src/**/*.ts"` | Análisis estático (modo interactivo) |
| `lint:ci` | `eslint "src/**/*.ts"` | Análisis estático (modo CI, sin `--fix`) |
| `lint:fix` | `eslint "src/**/*.ts" --fix` | Corrección automática de errores lint |
| `docs` | `typedoc --options typedoc.json` | Genera documentación en `src/exercises/home-work/docs/` |
| `test` | `jest` | Ejecuta la suite de tests unitarios |

---

## URLs de la aplicación

| Recurso | URL (desarrollo) |
|---|---|
| Índice | `http://localhost:5173/` |
| El Ahorcado | `http://localhost:5173/src/exercises/home-work/hangman/alvaro-perez-ramos-hangman.html` |
| Diagrama UML | `http://localhost:5173/src/exercises/home-work/uml/uml.html` |
| Documentación TypeDoc | `http://localhost:5173/src/exercises/home-work/docs/index.html` |
| Sesión de evaluación | `http://localhost:5173/src/exercises/evaluation-exercise1-title/alvaro-perez-ramos-evaluation.html` |

---

## Tecnologías y herramientas

| Tecnología | Uso |
|---|---|
| **TypeScript 5** | Lenguaje principal; tipado estricto, genéricos, tipos de unión |
| **Canvas API** | Renderizado del patíbulo y el ahorcado (fallback cuando los PNG no cargan) |
| **Bulma CSS 1.x** | Framework CSS para el índice y la interfaz del juego |
| **Vite 8** | Bundler, servidor de desarrollo con HMR |
| **TypeDoc** | Documentación de la API pública |
| **Mermaid** | Diagrama de clases UML en formato de texto |
| **ESLint** | Análisis estático (Google TypeScript Style Guide) |
| **Jest** | Tests unitarios |
| **GitHub Actions** | Pipeline CI/CD: lint → build → docs → deploy |
| **peaceiris/actions-gh-pages** | Despliegue en GitHub Pages via push a rama `gh-pages` |

---

## Referencias

- [MDN — Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Bulma CSS](https://bulma.io/documentation/)
- [Mermaid — Class Diagrams](https://mermaid.js.org/syntax/classDiagram.html)
- [TypeDoc](https://typedoc.org/)
- [Vite](https://vite.dev/)
- [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages)
- [Tipografía corporativa ULL — Argentum Sans](https://www.ull.es/portal/marca/tipografia/)
- [El juego del Ahorcado — Wikipedia](https://es.wikipedia.org/wiki/Ahorcado_(juego))

---

## Licencia

MIT License — véase el fichero `LICENSE` para los términos completos.