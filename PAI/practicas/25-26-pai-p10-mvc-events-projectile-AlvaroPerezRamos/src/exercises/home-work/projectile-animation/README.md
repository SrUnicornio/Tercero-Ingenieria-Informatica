# PAI — Práctica 10: Animación de Tiro Parabólico

## Autor

**Álvaro Pérez Ramos** — `alu0101574042@ull.edu.es`  
Universidad de La Laguna · ESIT · Grado en Ingeniería Informática  
Programación de Aplicaciones Interactivas — Curso 2025-26

---

## Propósito

Esta práctica tiene como objetivo aplicar:

- Programación gráfica en TypeScript usando la **Canvas API**
- Diseño orientado a objetos con el patrón **MVC**
- Principios **SOLID**
- Patrones de diseño: **Observer**, **Strategy**, **Template Method**, **Facade**
- Animación con `requestAnimationFrame`

---

## Descripción

La aplicación simula el lanzamiento de un proyectil con movimiento parabólico sobre un sistema de coordenadas cartesiano renderizado en un `<canvas>`.

Incluye:

- Sistema de coordenadas con cuadrícula y ejes escalables dinámicamente
- Animación de la bola de cañón frame a frame
- Estela de trayectoria opcional (checkbox)
- Acumulación de trayectorias anteriores
- Panel de información con tiempo de vuelo, distancia y altura máxima
- Dos layouts alternativos (HTML1: secciones apiladas; HTML2: columna lateral)

---

## Arquitectura

La aplicación sigue el patrón **MVC** con separación estricta de capas:

```
client.ts
  └── App                          ← Composición y DI (Facade)
        ├── ProjectileModel        ← Física + historial (Model)
        ├── ProjectileController   ← Orquestación + Observer
        ├── ProjectileView         ← Canvas P1: gráfica (View)
        ├── InfoView               ← Canvas P2: estadísticas (View)
        └── ControlsView           ← Panel P3: inputs y eventos (View)
```

### Sub-renderizadores de `ProjectileView`

```
ProjectileView
  ├── CoordinateSystem (Facade)
  │     ├── GridRenderer
  │     ├── AxisX  ──┐
  │     └── AxisY  ──┘ extienden Axis (Template Method)
  ├── CannonDrawer
  └── CoordinateTransformer
```

---

## Estructura de directorios

```text
.
├── public/
│   ├── index.html
│   └── styles.css
├── src/
│   └── exercises/
│       └── home-work/
│           ├── projectile-animation/
│           │   ├── client.ts                      ← Punto de entrada (layout 1)
│           │   ├── client2.ts                     ← Punto de entrada (layout 2)
│           │   ├── app.ts                         ← Composición MVC (layout 1)
│           │   ├── app2.ts                        ← Composición MVC (layout 2)
│           │   ├── alvaro-perez-ramos-projectile-animation.html
│           │   ├── alvaro-perez-ramos-projectile-animation2.html
│           │   ├── style-projectile.css
│           │   ├── style-projectile2.css
│           │   │
│           │   ├── model/
│           │   │   └── projectile-model.ts        ← Física + historial
│           │   │
│           │   ├── observer/
│           │   │   └── projectile-observer.ts     ← Interfaz Observer
│           │   │
│           │   ├── strategy/
│           │   │   └── trajectory-color-strategy.ts
│           │   │
│           │   ├── controller/
│           │   │   └── projectile-controller.ts
│           │   │
│           │   ├── view/
│           │   │   ├── projectile-view.ts         ← Facade canvas P1
│           │   │   ├── info-view.ts               ← Canvas P2
│           │   │   ├── controls-view.ts           ← Panel P3
│           │   │   ├── coordinate-system.ts       ← Facade cuadrícula+ejes
│           │   │   ├── grid-renderer.ts
│           │   │   ├── cannon-drawer.ts
│           │   │   └── axis/
│           │   │       ├── axis.ts                ← Clase abstracta (Template Method)
│           │   │       ├── axis-x.ts
│           │   │       └── axis-y.ts
│           │   │
│           │   └── util/
│           │       ├── coordinate-transformer.ts  ← metros ↔ píxeles
│           │       ├── tick-spacing-calculator.ts
│           │       └── compact-number-formatter.ts
│           │
│           └── uml/
│               └── uml.html                       ← Diagrama de clases
├── package.json
├── tsconfig.json
└── README.md
```

---

## Diseño

### Patrones aplicados

| Patrón          | Clase(s)                                    | Propósito                                                  |
| --------------- | ------------------------------------------- | ---------------------------------------------------------- |
| MVC             | `ProjectileModel`, `ProjectileController`, vistas | Separación de datos, lógica y presentación           |
| Observer        | `ProjectileObserver`, `ProjectileController` | Notificación de aterrizaje sin acoplamiento directo       |
| Strategy        | `IColorStrategy`, `CyclicColorStrategy`     | Color de trayectoria intercambiable sin tocar el controlador |
| Template Method | `Axis` → `AxisX`, `AxisY`                   | Algoritmo de dibujo de eje con pasos especializables       |
| Facade          | `App`, `ProjectileView`, `CoordinateSystem` | Ocultar complejidad de composición y sub-renderizadores    |

### Principios SOLID

| Principio | Aplicación                                                                 |
| --------- | -------------------------------------------------------------------------- |
| SRP       | Cada clase tiene una única responsabilidad (física, dibujo, control…)      |
| OCP       | Nuevas estrategias de color o layouts sin modificar el controlador          |
| LSP       | `AxisX` y `AxisY` son sustituibles por `Axis` en cualquier contexto        |
| ISP       | `ProjectileObserver` expone solo `onProjectileLanded`                      |
| DIP       | `ProjectileController` depende de `IColorStrategy`, no de la implementación |

---

## Física del proyectil

Las ecuaciones de movimiento usadas son:

```
x(t)  = v₀ · cos(θ) · t
y(t)  = y₀ + v₀ · sin(θ) · t − ½ · g · t²
```

donde `g = 9.81 m/s²`. El tiempo de aterrizaje se obtiene resolviendo la ecuación cuadrática `y(t) = 0`.

---

## URLs de la aplicación

| Página          | URL                                                                          |
| --------------- | ---------------------------------------------------------------------------- |
| Índice          | `http://localhost:8080/index.html`                                           |
| Layout 1        | `http://localhost:8080/alvaro-perez-ramos-projectile-animation.html`         |
| Layout 2        | `http://localhost:8080/alvaro-perez-ramos-projectile-animation2.html`        |
| Diagrama UML    | `http://localhost:8080/uml.html`                                             |
| TypeDoc         | `http://localhost:8080/docs/index.html`                                      |

---

## Instalación y ejecución

```bash
npm install
npm run build
npm run dev:server
npm run tsc:watch
```

---

## Referencias

- https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
- https://www.typescriptlang.org/docs/
- https://typedoc.org/
- https://eslint.org/

---

## Licencia

MIT License
