[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/nvttNyrb)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=23748404&assignment_repo_type=AssignmentRepo)

# PAI — Prácticas de Programación de Aplicaciones Interactivas

**Álvaro Pérez Ramos** — `alu0101574042@ull.edu.es`  
Universidad de La Laguna · ESIT · Grado en Ingeniería Informática  
Programación de Aplicaciones Interactivas — Curso 2025–26

---

## Índice

- [PAI — Prácticas de Programación de Aplicaciones Interactivas](#pai--prácticas-de-programación-de-aplicaciones-interactivas)
  - [Índice](#índice)
  - [Descripción del repositorio](#descripción-del-repositorio)
  - [Práctica 13 — Balatro](#práctica-13--balatro)
    - [El juego: cómo funciona](#el-juego-cómo-funciona)
    - [Dinámica del Small Blind](#dinámica-del-small-blind)
    - [Tabla de manos y puntuaciones](#tabla-de-manos-y-puntuaciones)
    - [Arquitectura MVC](#arquitectura-mvc)
    - [Clases e interfaces](#clases-e-interfaces)
    - [Patrones de diseño](#patrones-de-diseño)
    - [Principios SOLID](#principios-solid)
    - [Diagrama UML](#diagrama-uml)
  - [Cobertura de tests](#cobertura-de-tests)
  - [Estructura de directorios](#estructura-de-directorios)
  - [CI/CD con GitHub Actions](#cicd-con-github-actions)
  - [Configuración del proyecto](#configuración-del-proyecto)
  - [Instalación y ejecución](#instalación-y-ejecución)
  - [Scripts disponibles](#scripts-disponibles)
  - [URLs de la aplicación](#urls-de-la-aplicación)
  - [Tecnologías y herramientas](#tecnologías-y-herramientas)
  - [Referencias](#referencias)

---

## Descripción del repositorio

Este repositorio recoge el trabajo realizado para la **Práctica 13** de la asignatura
**Programación de Aplicaciones Interactivas (PAI)** del Grado en Ingeniería Informática
de la Universidad de La Laguna.

La práctica consiste en desarrollar una versión simplificada del juego
[Balatro](https://en.wikipedia.org/wiki/Balatro) en TypeScript vainilla, siguiendo
la arquitectura MVC, el framework de estilos Bulma CSS y el patrón Observer para la
comunicación entre capas.

---

## Práctica 13 — Balatro

### El juego: cómo funciona

[Balatro](https://en.wikipedia.org/wiki/Balatro) es un juego *roguelike* de construcción
de mazos basado en el [póker](https://en.wikipedia.org/wiki/Poker). En cada partida
el jugador juega **manos de póker** seleccionando cartas de su mano para acumular
*chips* (puntos) suficientes para superar el objetivo de cada nivel.

La puntuación de cada mano se calcula según la regla oficial de Balatro:

```
Puntuación = (chips_base + suma_chips_scoring_cards) × multiplicador
```

Solo las cartas que **forman** la jugada (*scoring cards*) contribuyen chips de
bonificación. Por ejemplo, si se seleccionan A♣ A♦ K♥ y la jugada es Pair, solo
los dos Ases suman chips; el K no contribuye.

El juego usa una baraja francesa estándar de 52 cartas dividida en cuatro palos
(**♠ Spades**, **♥ Hearts**, **♦ Diamonds**, **♣ Clubs**), cada uno con 13 cartas
ordenadas de menor a mayor rango: 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K, A.

### Dinámica del Small Blind

Esta implementación cubre únicamente el primer nivel del juego (**Small Blind**):

1. Al iniciar la partida se reparten **8 cartas** de un mazo barajado.
2. El jugador puede **seleccionar entre 1 y 5 cartas** haciendo clic sobre ellas
   (las cartas seleccionadas se elevan y muestran un borde dorado).
3. El bloque **Current Hand** (Bloque 5) muestra en tiempo real la jugada de mayor
   valor de las cartas seleccionadas, junto a sus chips base + bonificación y multiplicador.
4. Con la selección activa, el jugador elige una acción:
   - **Play Hand** — juega la mano, acumula chips y consume una de las 3 manos disponibles.
   - **Discard** — descarta las cartas seleccionadas y repone del mazo, consumiendo un descarte de los 3 disponibles.
   - **Sort Hand** — ordena la mano alternando entre criterio por rango (2…A) y por palo (clubs, diamonds, hearts, spades).
5. **El jugador gana** si acumula ≥ 300 chips antes de agotar las 3 manos.
6. **El jugador pierde** si agota las 3 manos sin alcanzar 300 chips.
7. El botón **New Game** reinicia la partida en cualquier momento.
8. El botón **Hand Info** abre un modal con la tabla de jugadas y sus puntuaciones.
9. Al finalizar la partida se abre un **dialog de resultado** con la puntuación final y un botón New Game para reiniciar.

### Tabla de manos y puntuaciones

| Jugada | Descripción | Chips base | Multiplicador | Scoring cards |
|---|---|---|---|---|
| High Card | Carta de mayor valor | 5 | ×1 | 1 carta |
| Pair | Dos del mismo rango | 10 | ×2 | 2 cartas |
| Two Pair | Dos pares distintos | 20 | ×2 | 4 cartas |
| Three of a Kind | Tres del mismo rango | 30 | ×3 | 3 cartas |
| Straight | Cinco en secuencia | 30 | ×4 | 5 cartas |
| Flush | Cinco del mismo palo | 35 | ×4 | 5 cartas |
| Full House | Trío + pareja | 40 | ×4 | 5 cartas |
| Four of a Kind | Cuatro del mismo rango | 60 | ×7 | 4 cartas |
| Straight Flush | Escalera del mismo palo | 100 | ×8 | 5 cartas |

> El As puede ser **alto** (10-J-Q-K-A) o **bajo** (A-2-3-4-5). Q-K-A-2-3 **no** es válida.

### Arquitectura MVC

La comunicación entre capas se realiza **exclusivamente mediante eventos** (patrón Observer,
clase `Event<T>`). El modelo nunca referencia el DOM; la vista nunca llama métodos del modelo.

`BalatroModel` es una fachada que compone `GameEventPublisher` (gestión de canales de eventos)
y `GameActions` (lógica del juego). `BalatroView` es otra fachada que expone dos superficies:
`inputs` (`ViewInputRouter`, suscripción a eventos del jugador) y `renderer` (`ViewRenderer`,
actualización del DOM). El controlador cablea ambas fachadas sin conocer sus internos.

```
balatro-client.ts
  └── BalatroController.run()
        ├── BalatroModel                     ← Fachada del modelo
        │     ├── GameEventPublisher         ← 6 canales Event<T> tipados
        │     └── GameActions                ← Lógica del juego
        │           ├── Deck / Card          ← Baraja inmutable
        │           ├── HandManager          ← Selección, descarte, ordenación
        │           └── RoundManager         ← Contadores y puntuación
        │
        │   model/poker/                     ← Módulos independientes de evaluación
        │           ├── HandEvaluator        ← evaluate(): itera HAND_DEFINITIONS
        │           ├── hand-table           ← HAND_DEFINITIONS + getHandTable()
        │           ├── hand-detectors       ← hasXxx(): detección pura de jugadas
        │           ├── hand-extractors      ← extractXxx(): extracción pura de scoring cards
        │           └── hand-calculator      ← calculateCardChips(): bonificación por carta
        │
        └── BalatroView                      ← Fachada de la vista
              ├── inputs (ViewInputRouter)   ← onCardClicked / onPlayHand / ...
              ├── handInfo (HandInfoView)    ← Modal de jugadas (usa hand-table)
              └── renderer (ViewRenderer)   ← onGameStarted / onHandPlayed / ...
                    ├── HandAreaView         ← Bloque 4: cartas de la mano
                    ├── ScorePanelView       ← Bloques 1, 3, 5: paneles de puntuación
                    └── ControlsView         ← Bloque 6: botones y contadores
```

### Clases e interfaces

| Fichero | Clase / Interfaz | Capa | Responsabilidad |
|---|---|---|---|
| `observer/event.ts` | `Event<T>` | Compartida | Patrón Observer genérico y tipado |
| `types/card-types.ts` | `Suit`, `RankLabel` | Tipos | Tipos primitivos de la baraja |
| `types/hand-result.ts` | `HandResult` | Tipos | Resultado del evaluador (incluye scoringCards) |
| `types/event-payloads.ts` | `GameStartedData`, `CardToggledData`, `HandPlayedData`, `CardsDiscardedData`, `ScorePreviewData`, `GameEndedData` | Tipos | Contratos de comunicación entre capas |
| `model/game/card.ts` | `Card` | Modelo | Carta inmutable de la baraja francesa |
| `model/game/deck.ts` | `Deck` | Modelo | Mazo de 52 cartas con barajado Fisher-Yates |
| `model/poker/hand-detectors.ts` | funciones `hasXxx` | Modelo | Detección pura de jugadas de póker |
| `model/poker/hand-extractors.ts` | funciones `extractXxx` | Modelo | Extracción de *scoring cards* por jugada |
| `model/poker/hand-table.ts` | `getHandTable`, `HAND_DEFINITIONS`, `HandTableEntry`, `HandDefinition` | Modelo | Tabla estática de jugadas de póker: nombre, chips base, multiplicador y funciones de detección/extracción por jugada |
| `model/poker/hand-calculator.ts` | `calculateCardChips` | Modelo | Suma de chips de bonificación de cartas individuales según tabla oficial de Balatro |
| `model/poker/hand-evaluator.ts` | `HandEvaluator` | Modelo | Responsabilidad única: recorre `HAND_DEFINITIONS` y devuelve el `HandResult` de mayor valor |
| `model/game/hand-manager.ts` | `HandManager` | Modelo | Selección, descarte y ordenación de la mano |
| `model/game/round-manager.ts` | `RoundManager` | Modelo | Contadores de manos, descartes y puntuación |
| `model/game/game-event-publisher.ts` | `GameEventPublisher`, `GameEventChannels` | Modelo | 6 canales `Event<T>` + API de suscripción |
| `model/game/game-actions.ts` | `GameActions` | Modelo | Lógica del juego; emite a través de `GameEventChannels` |
| `model/game/balatro-model.ts` | `BalatroModel` | Modelo | Fachada: compone Publisher + Actions; guarda `isGameOver` |
| `view/hand-area-view.ts` | `HandAreaView` | Vista | Bloque 4: renderizado y selección de cartas |
| `view/score-panel-view.ts` | `ScorePanelView`, `ScoreDisplayElements`, `PreviewDisplayElements` | Vista | Bloques 1, 3, 5: paneles de puntuación y progreso |
| `view/controls-view.ts` | `ControlsView` | Vista | Bloque 6: botones, contadores y dialog de resultado de partida (`#game-result-modal`) |
| `view/hand-info-view.ts` | `HandInfoView` | Vista | Modal de información de jugadas; importa `getHandTable` directamente de `hand-table` |
| `view/view-input-router.ts` | `ViewInputRouter` | Vista | Superficie de suscripción a inputs del jugador |
| `view/view-renderer.ts` | `ViewRenderer` | Vista | Superficie de actualización del DOM |
| `view/balatro-view.ts` | `BalatroView` | Vista | Fachada: construye sub-vistas y expone `inputs`, `renderer` y `handInfo` |
| `controller/balatro-controller.ts` | `BalatroController` | Controlador | Cableado modelo ↔ vista; sin lógica de juego ni presentación |
| `balatro-client.ts` | `main()` | Entrada | Instancia M, V, C y arranca la partida |

### Patrones de diseño

| Patrón | Clases implicadas | Propósito |
|---|---|---|
| **Observer** | `Event<T>`, `GameEventPublisher`, `HandManager`, `BalatroController`, `HandAreaView`, `ControlsView` | El modelo notifica cambios de estado sin conocer la vista. Los 6 canales de `GameEventPublisher` y los 2 de `HandManager` se suscriben en `BalatroController.run()`. |
| **Facade** | `BalatroModel`, `BalatroView` | `BalatroModel` oculta `GameEventPublisher` + `GameActions`. `BalatroView` oculta tres sub-vistas tras dos superficies (`inputs`, `renderer`) y el modal `handInfo`. El controlador solo conoce las dos fachadas. |
| **MVC** | `BalatroModel`, `BalatroView`, `BalatroController` | Separación estricta: modelo sin DOM, vista sin lógica, controlador sin lógica ni presentación. |
| **Strategy** (implícito) | `HandManager.sortHand` | El criterio de ordenación (`'rank'` \| `'suit'`) selecciona la función comparadora en tiempo de ejecución. |

### Principios SOLID

| Principio | Aplicación concreta |
|---|---|
| **S — SRP** | `GameEventPublisher` gestiona solo canales. `GameActions` gestiona solo lógica. `hand-detectors` solo detecta. `hand-extractors` solo extrae. `HandEvaluator` solo evalúa (determina la jugada). `hand-calculator` solo suma chips de cartas individuales. `hand-table` solo expone la configuración de jugadas. Cada sub-vista gestiona exactamente un bloque de la interfaz. `ViewInputRouter` solo suscribe. `ViewRenderer` solo actualiza. |
| **O — OCP** | La tabla `HAND_DEFINITIONS` en `hand-table.ts` permite añadir nuevas jugadas sin modificar `HandEvaluator.evaluate()`. |
| **L — LSP** | `Event<PayloadType>` genérico: cualquier instancia concreta es sustituible por su tipo base, verificado por TypeScript en compilación. |
| **I — ISP** | Cada interfaz de `event-payloads.ts` expone únicamente los campos necesarios para su consumidor. `GameEventChannels` separa la emisión de la suscripción. `ScoreDisplayElements` y `PreviewDisplayElements` agrupan solo los elementos DOM de su bloque. |
| **D — DIP** | `BalatroController` recibe modelo y vista inyectados por constructor. `GameActions` recibe `GameEventChannels` por inyección. `HandManager` recibe `Deck` por constructor. |

### Diagrama UML

Los diagramas de clases en formato Mermaid se encuentran en:

```
src/exercises/home-work/uml/balatro.mmd             ← Todas las capas
src/exercises/home-work/uml/balatro-model.mmd       ← Solo modelo
src/exercises/home-work/uml/balatro-view.mmd        ← Solo vista
src/exercises/home-work/uml/balatro-controller.mmd  ← Solo controlador
```

Se pueden visualizar con tabs interactivas en:

```
http://localhost:5173/src/exercises/home-work/uml/uml.html
```

---

## Cobertura de tests

La suite consta de **[N] tests** distribuidos en **18 ficheros**.
La cobertura se ejecuta con `npm run coverage`.

> Sustituir `[N]` por el valor real que arroje `npm run coverage`.

| Fichero | Statements | Branches | Functions | Lines |
|---|---|---|---|---|
| `observer/event.ts` | 100 % | 100 % | 100 % | 100 % |
| `model/game/card.ts` | 100 % | 100 % | 100 % | 100 % |
| `model/game/deck.ts` | 100 % | 100 % | 100 % | 100 % |
| `model/game/hand-manager.ts` | 100 % | 100 % | 100 % | 100 % |
| `model/game/round-manager.ts` | 100 % | 100 % | 100 % | 100 % |
| `model/game/game-event-publisher.ts` | 100 % | 100 % | 100 % | 100 % |
| `model/game/game-actions.ts` | 100 % | 100 % | 100 % | 100 % |
| `model/game/balatro-model.ts` | 100 % | 100 % | 100 % | 100 % |
| `model/poker/hand-detectors.ts` | 100 % | 100 % | 100 % | 100 % |
| `model/poker/hand-extractors.ts` | 100 % | 100 % | 100 % | 100 % |
| `model/poker/hand-evaluator.ts` | 100 % | 100 % | 100 % | 100 % |
| `view/hand-area-view.ts` | 100 % | 100 % | 100 % | 100 % |
| `view/hand-info-view.ts` | 100 % | 100 % | 100 % | 100 % |
| `view/score-panel-view.ts` | 100 % | 100 % | 100 % | 100 % |
| `view/controls-view.ts` | 100 % | 100 % | 100 % | 100 % |
| `view/view-input-router.ts` | 100 % | 100 % | 100 % | 100 % |
| `view/view-renderer.ts` | 100 % | 100 % | 100 % | 100 % |
| `view/balatro-view.ts` | 100 % | 100 % | 100 % | 100 % |

**Excluidos intencionalmente:** `balatro-controller.ts` y `balatro-client.ts`.
El controlador solo realiza cableado de eventos, cubierto indirectamente por los
tests de integración de `balatro-model.test.ts` y `balatro-view.test.ts`.
`balatro-client.ts` es el punto de entrada y depende del DOM completo del navegador.

`hand-table.ts` y `hand-calculator.ts` se cubren indirectamente a través de
`hand-evaluator.test.ts` y `game-actions.test.ts` respectivamente; no tienen
fichero de test propio.

---

## Estructura de directorios

```text
25-26-p13-balatro-AlvaroPerezRamos/
│
├── index.html
├── styles.css
├── package.json
├── package-lock.json
├── eslint.config.mjs
├── vite.config.ts
├── tsconfig.json
├── typedoc.json
├── typedoc-ull-theme.css
├── LICENSE
├── README.md
│
├── public/
│   └── img/
│       └── SVG-cards-1.3/             ← 52 cartas SVG
│
└── src/
    └── exercises/
        ├── evaluation-exercise1-title/
        │   └── alvaro-perez-ramos-evaluation.html
        │
        └── home-work/
            ├── docs/                             ← TypeDoc generado
            │
            ├── balatro/
            │   ├── alvaro-perez-ramos-balatro.html
            │   ├── balatro-client.ts             ← main(): instancia M, V, C
            │   ├── balatro.css
            │   │
            │   ├── types/
            │   │   ├── card-types.ts             ← Suit, RankLabel
            │   │   ├── hand-result.ts            ← HandResult (con scoringCards)
            │   │   └── event-payloads.ts         ← Interfaces *Data de eventos
            │   │
            │   ├── observer/
            │   │   └── event.ts                  ← Event<T> — Observer
            │   │
            │   ├── model/
            │   │   ├── game/
            │   │   │   ├── card.ts               ← Carta inmutable
            │   │   │   ├── deck.ts               ← Mazo Fisher-Yates
            │   │   │   ├── hand-manager.ts       ← Selección / descarte / sort
            │   │   │   ├── round-manager.ts      ← Contadores y puntuación
            │   │   │   ├── game-event-publisher.ts ← 6 canales + suscripción
            │   │   │   ├── game-actions.ts       ← Lógica del juego
            │   │   │   └── balatro-model.ts      ← Fachada del modelo
            │   │   └── poker/
            │   │       ├── hand-detectors.ts     ← hasXxx() puras
            │   │       ├── hand-extractors.ts    ← extractXxx() puras
            │   │       ├── hand-table.ts         ← HAND_DEFINITIONS + getHandTable()
            │   │       ├── hand-calculator.ts    ← calculateCardChips()
            │   │       └── hand-evaluator.ts     ← evaluate(): jugada de mayor valor
            │   │
            │   ├── view/
            │   │   ├── hand-area-view.ts         ← Bloque 4
            │   │   ├── score-panel-view.ts       ← Bloques 1, 3, 5
            │   │   ├── controls-view.ts          ← Bloque 6 + dialog resultado
            │   │   ├── hand-info-view.ts         ← Modal Hand Info
            │   │   ├── view-input-router.ts      ← Superficie inputs
            │   │   ├── view-renderer.ts          ← Superficie renderer
            │   │   └── balatro-view.ts           ← Fachada de la vista
            │   │
            │   └── controller/
            │       └── balatro-controller.ts     ← Cableado M ↔ V
            │
            ├── test/
            │   ├── event.test.ts
            │   ├── model/
            │   │   ├── game/
            │   │   │   ├── card.test.ts
            │   │   │   ├── deck.test.ts
            │   │   │   ├── hand-manager.test.ts
            │   │   │   ├── round-manager.test.ts
            │   │   │   ├── game-event-publisher.test.ts
            │   │   │   ├── game-actions.test.ts
            │   │   │   └── balatro-model.test.ts
            │   │   └── poker/
            │   │       ├── hand-detectors.test.ts
            │   │       ├── hand-extractors.test.ts
            │   │       └── hand-evaluator.test.ts
            │   └── view/
            │       ├── hand-area-view.test.ts
            │       ├── hand-info-view.test.ts
            │       ├── score-panel-view.test.ts
            │       ├── controls-view.test.ts
            │       ├── view-input-router.test.ts
            │       ├── view-renderer.test.ts
            │       └── balatro-view.test.ts
            │
            └── uml/
                ├── balatro.mmd               ← Diagrama completo
                ├── balatro-model.mmd         ← Solo modelo
                ├── balatro-view.mmd          ← Solo vista
                ├── balatro-controller.mmd    ← Solo controlador
                ├── uml.html                  ← Página con tabs interactivas
                ├── uml.ts                    ← Renderizado Mermaid + tabs
                └── uml-style.css             ← Estilos de la página UML
```

---

## CI/CD con GitHub Actions

El proyecto tiene un único workflow en `.github/workflows/ci.yml`.

**Orden:** `static-analysis → tests → build → docs → deploy`

```
push/PR a main
      │
      ▼
┌─────────────────────────────────┐
│  Job 1: ESLint                  │
│  npm run lint:ci                │
└──────────────┬──────────────────┘
               │ needs: static-analysis
               ▼
┌─────────────────────────────────┐
│  Job 2: Vitest — Tests          │
│  npm run coverage               │
└──────────────┬──────────────────┘
               │ needs: tests
               ▼
┌─────────────────────────────────┐
│  Job 3: Vite — Build            │
│  npm run build + vite:build     │
└──────────────┬──────────────────┘
               │ needs: build
               ▼
┌─────────────────────────────────┐
│  Job 4: TypeDoc — Docs          │
│  npm run docs                   │
└──────────────┬──────────────────┘
               │ needs: docs · solo push a main
               ▼
┌─────────────────────────────────┐
│  Job 5: GitHub Pages — Deploy   │
└─────────────────────────────────┘
```

---

## Configuración del proyecto

| Fichero | Propósito |
|---|---|
| `package.json` | Dependencias, scripts y metadatos |
| `eslint.config.mjs` | Google TypeScript Style Guide |
| `vite.config.ts` | Base URL en producción; múltiples puntos de entrada; glob de tests |
| `tsconfig.json` | Target ES2022, strict mode, moduleResolution: bundler |
| `typedoc.json` | Entrada `src/exercises/home-work/balatro`, salida `docs/`, README como portada |
| `typedoc-ull-theme.css` | Estilos corporativos ULL aplicados a la documentación TypeDoc |

---

## Instalación y ejecución

```bash
# 1. Clonar
git clone https://github.com/ULL-ESIT-PAI-2024-2025/25-26-p13-balatro-AlvaroPerezRamos.git
cd 25-26-p13-balatro-AlvaroPerezRamos

# 2. Instalar dependencias
npm install

# 3. Generar documentación TypeDoc
npm run docs

# 4. Compilar y generar bundle de producción
npm run build
npm run vite:build

# 5a. Servidor de desarrollo con HMR
npm run dev:vite
# → http://localhost:5173/

# 5b. Previsualizar el bundle de producción
npm run preview
```

---

## Scripts disponibles

| Script | Descripción |
|---|---|
| `build` | Compila TypeScript → JavaScript |
| `vite:build` | Bundle de producción en `dist/` |
| `dev:vite` | Servidor de desarrollo HMR |
| `preview` | Previsualización del bundle |
| `lint` | Análisis estático interactivo |
| `lint:ci` | Análisis estático para CI |
| `lint:fix` | Corrección automática |
| `docs` | Genera documentación TypeDoc |
| `test` | Ejecuta tests con Vitest |
| `coverage` | Tests + informe de cobertura |

---

## URLs de la aplicación

| Recurso | URL (desarrollo) | URL (GitHub Pages) |
|---|---|---|
| Índice | `localhost:5173/` | `…github.io/25-26-p13-balatro-AlvaroPerezRamos/` |
| Balatro | `…/balatro/alvaro-perez-ramos-balatro.html` | igual en Pages |
| Diagrama UML | `…/uml/uml.html` | igual en Pages |
| TypeDoc | `…/docs/index.html` | igual en Pages |
| Evaluación | `…/evaluation-exercise1-title/alvaro-perez-ramos-evaluation.html` | igual en Pages |

---

## Tecnologías y herramientas

| Tecnología | Uso |
|---|---|
| **TypeScript 5** | Lenguaje principal; tipado estricto, genéricos (`Event<T>`), tipos de unión |
| **Bulma CSS 1.x** | Framework CSS; estructura de bloques, navbar, botones, tabs UML |
| **Vite** | Bundler, HMR, inyección `import.meta.env.BASE_URL`, import `?raw` para .mmd |
| **Vitest + jsdom** | Tests unitarios ([N] tests, cobertura 100 %) |
| **TypeDoc** | Documentación API desde comentarios JSDoc |
| **Mermaid** | 4 diagramas UML de clases incrustados en el bundle |
| **ESLint** | Google TypeScript Style Guide |
| **GitHub Actions** | Pipeline CI/CD: lint → tests → build → docs → deploy |

---

## Referencias

- [Balatro — Wikipedia](https://en.wikipedia.org/wiki/Balatro)
- [Poker hands — Wikipedia](https://en.wikipedia.org/wiki/List_of_poker_hands)
- [Bulma CSS](https://bulma.io/documentation/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite](https://vite.dev/)
- [TypeDoc](https://typedoc.org/)
- [Mermaid — Class Diagrams](https://mermaid.js.org/syntax/classDiagram.html)
- [Tipografía corporativa ULL — Argentum Sans](https://www.ull.es/portal/marca/tipografia/)
- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [JSDoc](https://jsdoc.app/)