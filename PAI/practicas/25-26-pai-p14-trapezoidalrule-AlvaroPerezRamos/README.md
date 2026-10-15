[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/qsnPcA12)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=23813801&assignment_repo_type=AssignmentRepo)

# PAI — Prácticas de Programación de Aplicaciones Interactivas

**Álvaro Pérez Ramos** — `alu0101574042@ull.edu.es`  
Universidad de La Laguna · ESIT · Grado en Ingeniería Informática  
Programación de Aplicaciones Interactivas — Curso 2025–26

---

## Índice

- [PAI — Prácticas de Programación de Aplicaciones Interactivas](#pai--prácticas-de-programación-de-aplicaciones-interactivas)
  - [Índice](#índice)
  - [Descripción](#descripción)
    - [La regla del trapecio](#la-regla-del-trapecio)
    - [Interfaz de la aplicación](#interfaz-de-la-aplicación)
  - [Estructura de directorios](#estructura-de-directorios)
  - [Instalación y ejecución](#instalación-y-ejecución)
  - [Scripts disponibles](#scripts-disponibles)
  - [Arquitectura MVC](#arquitectura-mvc)
    - [Orden de render](#orden-de-render)
    - [Sistema de coordenadas unificado](#sistema-de-coordenadas-unificado)
  - [Clases e interfaces](#clases-e-interfaces)
  - [Diagrama UML](#diagrama-uml)
  - [Cobertura de tests](#cobertura-de-tests)
    - [Estrategia de tests](#estrategia-de-tests)
  - [CI/CD con GitHub Actions](#cicd-con-github-actions)
  - [URLs de la aplicación](#urls-de-la-aplicación)
  - [Tecnologías y herramientas](#tecnologías-y-herramientas)
  - [Referencias](#referencias)

---

## Descripción

Este repositorio recoge el trabajo realizado para la **Práctica 14** de la asignatura
**Programación de Aplicaciones Interactivas (PAI)** del Grado en Ingeniería Informática
de la Universidad de La Laguna.

La práctica consiste en desarrollar una **calculadora de áreas mediante la
[regla del trapecio](https://en.wikipedia.org/wiki/Trapezoidal_rule)** en TypeScript,
con visualización interactiva sobre Canvas API y estilos Bulma CSS.

### La regla del trapecio

La [regla del trapecio](https://en.wikipedia.org/wiki/Trapezoidal_rule) es un método
de integración numérica que aproxima el valor de una integral definida dividiendo el
intervalo `[a, b]` en `n` subintervalos de igual anchura y sumando las áreas de los
trapecios resultantes:

```
h = (b − a) / n
Área ≈ h/2 · [f(a) + 2·f(x₁) + 2·f(x₂) + ... + 2·f(xₙ₋₁) + f(b)]
```

Cuanto mayor es `n`, mejor es la aproximación al valor real de la integral.

### Interfaz de la aplicación

La aplicación se presenta como una SPA sin scroll que replica la
[referencia de Academo](https://academo.org/demos/trapezoidal-rule-calculator/):

- **Canvas** (~75 % del ancho): cuadrícula con líneas menores y mayores anclada en
  el origen matemático, ejes X e Y con ticks y etiquetas compactas (k, M, G),
  relleno rosa translúcido de los trapecios, líneas de división discontinuas,
  puntos rojos en los vértices y la curva continua en azul encima.
- **Panel de controles** (~25 % del ancho, a la derecha): campos *Expression*,
  *Number of Trapezoids*, *Start*, *End* y botón *Update*.
- **Resultado** debajo del canvas: `Sum of all Trapezium areas: X.XXX`.

Al pulsar *Update*, la aplicación evalúa la expresión con
[mathjs](https://mathjs.org/), recalcula los trapecios y repinta el canvas.

---

## Estructura de directorios

```text
25-26-pai-p14-trapezoidalrule-AlvaroPerezRamos/
│
├── index.html
├── package.json
├── eslint.config.mjs
├── vite.config.ts
├── tsconfig.json
├── typedoc.json
├── LICENSE
├── README.md
│
└── src/
    └── exercises/
        ├── evaluation-exercise1-title/
        │   ├── alvaro-perez-ramos-evaluation.html
        │   └── evaluation.ts
        │
        └── home-work/
            ├── docs/                             ← TypeDoc generado
            │
            ├── trapezoid/
            │   ├── alvaro-perez-ramos-trapezoid.html
            │   ├── trapezoid-client.ts           ← main(): instancia M, V, C
            │   ├── trapezoid.css
            │   │
            │   ├── interfaces/
            │   │   ├── coordinate-config.ts      ← Config unificada grid + ejes
            │   │   └── trapezoid-params.ts       ← Parámetros de entrada
            │   │
            │   ├── observer/
            │   │   └── event.ts                  ← Event<T> — patrón Observer
            │   │
            │   ├── model/
            │   │   ├── function-evaluator.ts     ← Evalúa expresiones con mathjs
            │   │   ├── trapezoid-calculator.ts   ← Regla del trapecio compuesta
            │   │   └── trapezoid-model.ts        ← Fachada del modelo
            │   │
            │   ├── util/
            │   │   ├── coordinate-transformer.ts ← Fuente de verdad: math → px
            │   │   └── tick-calculator.ts        ← Espaciado 1/2/5×10ⁿ
            │   │
            │   └── view/
            │       ├── axis/
            │       │   ├── axis.ts               ← Clase base (Template Method)
            │       │   ├── axis-x.ts             ← Eje horizontal
            │       │   └── axis-y.ts             ← Eje vertical
            │       ├── canvas-view.ts            ← Gestión del HTMLCanvasElement
            │       ├── controls-view.ts          ← Panel de controles y validación
            │       ├── coordinate-system.ts      ← Fachada: grid + ejes
            │       ├── function-renderer.ts      ← Curva f(x) sobre el canvas
            │       ├── grid-renderer.ts          ← Cuadrícula anclada en 0
            │       ├── result-view.ts            ← Área total en texto
            │       ├── trapezoid-renderer.ts     ← Relleno, líneas y vértices
            │       └── trapezoid-view.ts         ← Fachada de la vista
            │
            ├── test/
            │   ├── model/
            │   │   ├── function-evaluator.test.ts
            │   │   ├── trapezoid-calculator.test.ts
            │   │   └── trapezoid-model.test.ts
            │   ├── observer/
            │   │   └── event.test.ts
            │   ├── util/
            │   │   ├── coordinate-transformer.test.ts
            │   │   └── tick-calculator.test.ts
            │   └── view/
            │       ├── canvas-context.mock.ts
            │       ├── axis-x.test.ts
            │       ├── axis-y.test.ts
            │       ├── canvas-view.test.ts
            │       ├── controls-view.test.ts
            │       ├── coordinate-system.test.ts
            │       ├── function-renderer.test.ts
            │       ├── grid-renderer.test.ts
            │       ├── result-view.test.ts
            │       ├── trapezoid-renderer.test.ts
            │       └── trapezoid-view.test.ts
            │
            └── uml/
                ├── trapezoid.mmd             ← Diagrama completo
                ├── trapezoid-model.mmd       ← Solo modelo
                ├── trapezoid-view.mmd        ← Solo vista
                ├── trapezoid-controller.mmd  ← Solo controlador
                ├── uml.html
                └── uml.ts
```

---

## Instalación y ejecución

```bash
# 1. Clonar
git clone https://github.com/ULL-ESIT-PAI-2024-2025/25-26-pai-p14-trapezoidalrule-AlvaroPerezRamos.git
cd 25-26-pai-p14-trapezoidalrule-AlvaroPerezRamos

# 2. Instalar dependencias
npm install

# 3. Generar documentación TypeDoc
npm run docs

# 4. Servidor de desarrollo con HMR
npm run dev:vite
# → http://localhost:5173/

# 5. Compilar y generar bundle de producción
npm run build
npm run vite:build

# 6. Previsualizar el bundle de producción
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
| `coverage` | Tests + informe de cobertura v8 |

---

## Arquitectura MVC

La comunicación entre capas se realiza **exclusivamente mediante el patrón Observer**
(clase genérica `Event<T>`). El modelo nunca referencia el DOM; la vista nunca llama
métodos del modelo directamente.

```
trapezoid-client.ts
  └── TrapezoidController.run()
        ├── TrapezoidModel                    ← Fachada del modelo
        │     ├── FunctionEvaluator           ← Evalúa f(x) con mathjs
        │     └── TrapezoidCalculator         ← Regla del trapecio compuesta
        │
        └── TrapezoidView                     ← Fachada de la vista
              ├── CanvasView                  ← Gestión del canvas + contexto 2D
              ├── ControlsView                ← Inputs, validación, onUpdateRequested
              ├── ResultView                  ← Párrafo de área total
              └── CoordinateSystem            ← Fachada: grid + ejes
                    ├── GridRenderer          ← Cuadrícula anclada en 0
                    ├── AxisX                 ← Eje horizontal con ticks y etiquetas
                    └── AxisY                 ← Eje vertical con ticks y etiquetas
```

### Orden de render

El controlador construye un `CoordinateTransformer` unificado y llama en este orden:

1. `renderCoordinateSystem` — grid y ejes (fondo)
2. `renderTrapezoids` — relleno rosa, líneas discontinuas, puntos rojos
3. `renderFunction` — curva f(x) en azul (siempre encima del relleno)
4. `renderResult` — actualiza el párrafo de texto

### Sistema de coordenadas unificado

`CoordinateTransformer` es la **fuente de verdad única** para la conversión entre
coordenadas matemáticas y píxeles. Tanto `GridRenderer` como `AxisX`, `AxisY` y
`TrapezoidRenderer` consumen el mismo transformer, garantizando alineación perfecta.

El espaciado de ticks y grid se calcula con `TickCalculator` (algoritmo 1/2/5×10ⁿ).
Ambos sistemas anclan su iteración en `y = 0` para que el cero sea siempre visible.

---

## Clases e interfaces

| Fichero | Clase / Interfaz | Capa | Responsabilidad |
|---|---|---|---|
| `observer/event.ts` | `Event<T>` | Compartida | Canal Observer genérico y tipado |
| `interfaces/trapezoid-params.ts` | `TrapezoidParams` | Tipos | Parámetros de entrada del usuario |
| `interfaces/coordinate-config.ts` | `CoordinateConfig` | Tipos | Config unificada: márgenes, grid y ejes |
| `util/coordinate-transformer.ts` | `CoordinateTransformer`, `CanvasLayout`, `CoordinateDomain` | Util | Fuente de verdad: transformación math → px |
| `util/tick-calculator.ts` | `TickCalculator` | Util | Espaciado 1/2/5×10ⁿ para ticks y grid |
| `model/function-evaluator.ts` | `FunctionEvaluator` | Modelo | Compila y evalúa expresiones con mathjs |
| `model/trapezoid-calculator.ts` | `TrapezoidCalculator`, `TrapezoidPoint`, `TrapezoidResult` | Modelo | Regla del trapecio compuesta: área y vértices |
| `model/trapezoid-model.ts` | `TrapezoidModel`, `YRange` | Modelo | Fachada: parámetros, evaluación, rango Y y área |
| `view/axis/axis.ts` | `Axis` | Vista | Clase base abstracta — Template Method |
| `view/axis/axis-x.ts` | `AxisX` | Vista | Eje horizontal: línea, ticks, etiquetas compactas |
| `view/axis/axis-y.ts` | `AxisY` | Vista | Eje vertical: línea, ticks, etiquetas compactas |
| `view/canvas-view.ts` | `CanvasView` | Vista | Gestión de `HTMLCanvasElement` y contexto 2D |
| `view/controls-view.ts` | `ControlsView` | Vista | Panel de controles, validación y evento |
| `view/coordinate-system.ts` | `CoordinateSystem` | Vista | Fachada: grid + ejes sobre el mismo transformer |
| `view/function-renderer.ts` | `FunctionRenderer` | Vista | Dibuja la curva f(x) con detección de asíntotas |
| `view/grid-renderer.ts` | `GridRenderer` | Vista | Cuadrícula de fondo anclada en 0 |
| `view/result-view.ts` | `ResultView` | Vista | Párrafo de área total (3 decimales) |
| `view/trapezoid-renderer.ts` | `TrapezoidRenderer` | Vista | Relleno rosa, líneas discontinuas y vértices rojos |
| `view/trapezoid-view.ts` | `TrapezoidView` | Vista | Fachada de la vista |
| `controller/trapezoid-controller.ts` | `TrapezoidController` | Controlador | Cableado modelo ↔ vista; construye el transformer |
| `trapezoid-client.ts` | `main()` | Entrada | Instancia M, V, C y arranca la app |

---

## Diagrama UML

Los diagramas de clases en formato Mermaid se encuentran en:

```
src/exercises/home-work/uml/
  trapezoid.mmd             ← Diagrama completo
  trapezoid-model.mmd       ← Solo modelo
  trapezoid-view.mmd        ← Solo vista
  trapezoid-controller.mmd  ← Solo controlador
```

Visualizable con tabs interactivas en:

```
http://localhost:5173/src/exercises/home-work/uml/uml.html
```

---

## Cobertura de tests

La suite consta de **214 tests** distribuidos en **15 ficheros**.
Se ejecuta con `npm run coverage`.

| Fichero | Statements | Branches | Functions | Lines |
|---|---|---|---|---|
| `observer/event.ts` | 100 % | 100 % | 100 % | 100 % |
| `interfaces/coordinate-config.ts` | 100 % | 100 % | 100 % | 100 % |
| `interfaces/trapezoid-params.ts` | 100 % | 100 % | 100 % | 100 % |
| `model/function-evaluator.ts` | 100 % | 100 % | 100 % | 100 % |
| `model/trapezoid-calculator.ts` | 100 % | 100 % | 100 % | 100 % |
| `model/trapezoid-model.ts` | 100 % | 100 % | 100 % | 100 % |
| `util/coordinate-transformer.ts` | 100 % | 100 % | 100 % | 100 % |
| `util/tick-calculator.ts` | 100 % | 100 % | 100 % | 100 % |
| `view/axis/axis.ts` | 100 % | 100 % | 100 % | 100 % |
| `view/axis/axis-x.ts` | 100 % | 100 % | 100 % | 100 % |
| `view/axis/axis-y.ts` | 100 % | 100 % | 100 % | 100 % |
| `view/canvas-view.ts` | 95 % | 87 % | 100 % | 95 % |
| `view/controls-view.ts` | 100 % | 100 % | 100 % | 100 % |
| `view/coordinate-system.ts` | 100 % | 100 % | 100 % | 100 % |
| `view/function-renderer.ts` | 97 % | 90 % | 100 % | 100 % |
| `view/grid-renderer.ts` | 100 % | 100 % | 100 % | 100 % |
| `view/result-view.ts` | 100 % | 100 % | 100 % | 100 % |
| `view/trapezoid-renderer.ts` | 100 % | 100 % | 100 % | 100 % |
| `view/trapezoid-view.ts` | 100 % | 100 % | 100 % | 100 % |

**Excluidos intencionalmente:** `trapezoid-controller.ts` y `trapezoid-client.ts`
requieren el DOM completo del navegador con `ResizeObserver`.

### Estrategia de tests

- `util/` y `model/` — funciones puras sin dependencias externas. El import CDN
  de mathjs se redirige al paquete npm con `vi.mock`.
- `observer/` — `vi.fn()` verifica que `trigger` llama a todos los listeners en orden.
- `view/` — `vi.spyOn(HTMLCanvasElement.prototype, 'getContext')` intercepta el
  contexto 2D. Los tests DOM montan elementos en `document.body` en `beforeEach`
  y limpian con `afterEach`. `vi.spyOn` sobre prototipos verifica delegación.

---

## CI/CD con GitHub Actions

El proyecto tiene un único workflow en `.github/workflows/ci.yml`.

**Orden:** `static-analysis → tests → build → docs → deploy`

```
push / PR a main
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

## URLs de la aplicación

| Recurso | URL (desarrollo) | URL (GitHub Pages) |
|---|---|---|
| Índice | `localhost:5173/` | `…github.io/25-26-pai-p14-trapezoidalrule-AlvaroPerezRamos/` |
| Calculadora | `…/trapezoid/alvaro-perez-ramos-trapezoid.html` | igual en Pages |
| Diagrama UML | `…/uml/uml.html` | igual en Pages |
| TypeDoc | `…/docs/index.html` | igual en Pages |
| Evaluación | `…/evaluation-exercise1-title/alvaro-perez-ramos-evaluation.html` | igual en Pages |

---

## Tecnologías y herramientas

| Tecnología | Uso |
|---|---|
| **TypeScript 5** | Lenguaje principal; tipado estricto, genéricos (`Event<T>`) |
| **mathjs** | Evaluación de expresiones matemáticas introducidas por el usuario |
| **Canvas API** | Renderizado de cuadrícula, ejes, trapecios y curva |
| **Bulma CSS 1.x** | Framework CSS; navbar, panel de controles, layout SPA |
| **Vite** | Bundler y servidor de desarrollo con HMR |
| **Vitest + jsdom** | 214 tests unitarios con cobertura v8 |
| **TypeDoc** | Documentación API desde comentarios JSDoc |
| **Mermaid** | 4 diagramas UML de clases |
| **ESLint** | Google TypeScript Style Guide |
| **GitHub Actions** | Pipeline CI/CD: lint → tests → build → docs → deploy |

---

## Referencias

- [Trapezoidal Rule — Wikipedia](https://en.wikipedia.org/wiki/Trapezoidal_rule)
- [Trapezoidal Rule Calculator (referencia)](https://academo.org/demos/trapezoidal-rule-calculator/)
- [mathjs](https://mathjs.org/)
- [Canvas API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Bulma CSS](https://bulma.io/documentation/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite](https://vite.dev/)
- [TypeDoc](https://typedoc.org/)
- [Mermaid — Class Diagrams](https://mermaid.js.org/syntax/classDiagram.html)
- [Tipografía corporativa ULL — Argentum Sans](https://www.ull.es/portal/marca/tipografia/)
- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [JSDoc](https://jsdoc.app/)