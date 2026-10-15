# PAI — Práctica 9: Canvas API. Representación de Funciones

## Autor

**Álvaro Pérez Ramos** — `alu0101574042@ull.edu.es`
Universidad de La Laguna · ESIT · Grado en Ingeniería Informática
Programación de Aplicaciones Interactivas — Curso 2025-26

---

## Propósito

Esta práctica tiene como objetivo aplicar:

* Programación gráfica en TypeScript usando la **Canvas API**
* Diseño orientado a objetos
* Principios **SOLID**
* Patrón de diseño **Facade**
* Evaluación dinámica de expresiones matemáticas con **mathjs**

---

## Descripción

La aplicación permite representar funciones matemáticas en un sistema de coordenadas cartesiano renderizado sobre un `<canvas>`.

Incluye:

* Cuadrícula configurable (grid mayor y menor)
* Ejes con ticks y etiquetas numéricas
* Representación continua de funciones
* Evaluación dinámica de expresiones introducidas por el usuario

---

## Arquitectura

Se ha aplicado una **modularización por responsabilidades**, evitando un "God file" y separando claramente cada subsistema.

```
main.ts
  └── App                          ← Facade de aplicación
        ├── CartesianCoordinateSystem  ← Facade del sistema gráfico
        │     ├── CanvasManager
        │     ├── CoordinateSystemModel
        │     ├── GridRenderer
        │     ├── AxisRenderer
        │     └── FunctionPlotter
        └── ExpressionFunction     ← Adaptador de mathjs
```

---

## Estructura de directorios

```text
.
├── dist/                          ← JS transpilado (generado, ignorado en git)
├── public/
│   ├── index.html                 ← Página índice de la práctica
│   └── styles.css
├── scripts/
│   └── dev-server.js              ← Servidor Express con LiveReload
├── src/
│   └── exercises/
│       └── home-work/
│           ├── docs/              ← Documentación TypeDoc (generada)
│           ├── function-rendering/
│           │   ├── app.ts                 ← Fachada principal (App)
│           │   ├── main.ts                ← Punto de entrada
│           │   │
│           │   ├── config.ts              ← Configuración (DEFAULT_CARTESIAN_GRID_CONFIG)
│           │   │
│           │   ├── coordinate.ts          ← Fachada + modelo de coordenadas
│           │   │
│           │   ├── render.ts              ← Renderers y utilidades de dibujo
│           │   │   ├── CanvasManager
│           │   │   ├── LineDrawer
│           │   │   ├── GridRenderer
│           │   │   ├── AxisRenderer
│           │   │   └── FunctionPlotter
│           │   │
│           │   ├── math-functions.ts      ← Modelo de funciones matemáticas (mathjs)
│           │   │
│           │   ├── style-function-rendering.css
│           │   └── alvaro-perez-ramos-function-rendering.html
│           └── uml/
│               ├── uml.html
│               ├── uml.ts
│               └── function-rendering.mmd
├── .gitignore
├── eslint.config.mjs
├── package.json
├── tsconfig.json
├── typedoc.json
└── README.md
```

---

## Diseño

### Patrón Facade

Se utilizan dos niveles de fachada:

| Nivel | Clase                       | Responsabilidad                                    |
| ----- | --------------------------- | -------------------------------------------------- |
| 1     | `App`                       | Orquestación general (DOM + eventos + renderizado) |
| 2     | `CartesianCoordinateSystem` | Abstracción del sistema gráfico                    |

---

### Principios SOLID

| Principio | Aplicación                                                       |
| --------- | ---------------------------------------------------------------- |
| SRP       | Cada clase tiene una única responsabilidad                       |
| OCP       | `MathFunction` permite nuevas funciones sin modificar el sistema |
| DIP       | `FunctionPlotter` depende de la abstracción `MathFunction`       |
| ISP       | Interfaces pequeñas (`EvalFunction`, `MathJsStatic`)             |
| LSP       | `ExpressionFunction` sustituye correctamente a `MathFunction`    |

---

## Sistema de coordenadas

El sistema es configurable mediante `CartesianGridConfig`.

Conceptos clave:

* `majorStepPx` → distancia en píxeles entre líneas principales
* `unitsPerTickX/Y` → unidades matemáticas representadas por cada división
* Escalado independiente en X e Y (soporte para distorsión)

---

## Evaluación de funciones

Las expresiones se evalúan usando:

* `mathjs` desde CDN
* Compilación previa (`compile`)
* Evaluación segura con control de errores

Ejemplo:

```
sin(x)
x^2 - 3
exp(x)
log(x)
```

---

## URLs de la aplicación

| Página     | URL                                                                |
| ---------- | ------------------------------------------------------------------ |
| Índice     | http://10.6.128.52:8080/index.html                                 |
| Aplicación | http://10.6.128.52:8080/alvaro-perez-ramos-function-rendering.html |
| UML        | http://10.6.128.52:8080/uml.html                                   |
| TypeDoc    | http://10.6.128.52:8080/docs/index.html                            |

---

## Instalación y ejecución

```bash
npm install
npm run build
npm run dev:server
npm run tsc:watch
```

---

## Funciones recomendadas para prueba

Para validar el sistema:

### Básicas

```
sin(x)
cos(x)
x^2
```

### Discontinuidades

```
1/x
tan(x)
```

### Crecimiento

```
exp(x)
log(x)
```

### Combinadas

```
sin(x) * exp(-x/5)
x * sin(x)
```

---

## Referencias

* https://mathjs.org/
* https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
* https://typedoc.org/
* https://jestjs.io/
* https://eslint.org/

---

## Licencia

MIT License
