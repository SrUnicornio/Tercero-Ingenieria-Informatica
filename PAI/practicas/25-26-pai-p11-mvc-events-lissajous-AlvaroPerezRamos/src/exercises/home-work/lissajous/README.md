# PAI — Práctica 11: Curvas de Lissajous

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
- Patrones de diseño: **Facade**, **Observer**
- Animación con `requestAnimationFrame`
- Manejo de eventos HTML: `input[type="number"]`, `input[type="range"]` y `input[type="checkbox"]`
- Estilado de la interfaz con **Bulma CSS** e identidad corporativa ULL

---

## Descripción

La aplicación dibuja curvas de Lissajous animadas sobre un canvas cuadrado con cuadrícula de fondo.  
El usuario puede modificar los parámetros de la curva en tiempo real desde el panel de controles de la derecha.

Parámetros editables:

| Parámetro | ID HTML | Descripción |
|-----------|---------|-------------|
| **Frecuencia X** (`a`) | `inputFrequencyX` / `sliderFrequencyX` | Frecuencia del movimiento armónico horizontal |
| **Frecuencia Y** (`b`) | `inputFrequencyY` / `sliderFrequencyY` | Frecuencia del movimiento armónico vertical |
| **Desfase** (`φ`) | `inputPhaseShift` / `sliderPhaseShift` | Desfase en múltiplos de π (0 → 0 rad, 2 → 2π rad) |
| **Animar φ** | `checkboxPhaseAnimated` | Activa/desactiva la animación automática del desfase |
| **Amplitud X** (`A`) | `inputAmplitudeX` / `sliderAmplitudeX` | Amplitud horizontal en píxeles |
| **Amplitud Y** (`B`) | `inputAmplitudeY` / `sliderAmplitudeY` | Amplitud vertical en píxeles |

Las ecuaciones paramétricas de la curva son (t ∈ [0, 2π]):

```
x(t) = A · sin(a·t + φ·π)
y(t) = B · sin(b·t)
```

---

## Arquitectura

La aplicación sigue el patrón **MVC** con separación estricta de capas:

```
lissajous-client.ts          ← main(): instancia M, V y C
  └── LissajousController    ← Orquestación + bucle de animación (requestAnimationFrame)
        ├── LissajousModel   ← Parámetros + cálculo matemático + animación del desfase
        └── LissajousView    ← Facade: canvas (cuadrícula + curva) y controles HTML
              ├── GridRenderer        ← Cuadrícula de dos niveles (mayor/menor)
              └── ControlsPanel       ← Facade del panel de parámetros
                    ├── NumericInputsGroup   ← inputs type="number"
                    └── SliderInputsGroup    ← inputs type="range"
```

---

## Estructura de directorios

```text
25-26-pai-p11-mvc-events-lissajous-AlvaroPerezRamos-main/
├── .gitignore
├── LICENSE
├── README.md
├── eslint.config.mjs
├── p11_Events-Lissajous.md            ← Enunciado de la práctica
├── package.json
├── tsconfig.json                      ← tsconfig raíz del proyecto
├── typedoc.json                       ← Configuración de TypeDoc con tema ULL
│
├── dist/                       ← Generado por tsc (no editar)│
│
├── public/
│   ├── index.html                     ← Página índice (SPA)
│   └── styles.css                     ← Estilos del índice (identidad ULL)
│
├── scripts/
│   └── dev-server.js                  ← Servidor Express + LiveReload
│
└── src/
    └── exercises/
        ├── evaluation-exercise1-title/
        │   └── .gitkeep
        │
        └── home-work/
            │
            ├── docs/                  ← Generado por TypeDoc (no editar)
            │   ├── assets/
            │   │   ├── custom.css     ← CSS inyectado por typedoc-ull-theme.css
            │   │   └── style.css
            │   ├── classes/           ← Páginas de clases generadas
            │   ├── interfaces/        ← Páginas de interfaces generadas
            │   ├── modules/           ← Páginas de módulos generadas
            │   ├── variables/         ← Páginas de constantes generadas
            │   ├── hierarchy.html
            │   └── index.html
            │
            ├── lissajous/
            │   ├── README.md                              ← Este fichero
            │   ├── alvaro-perez-ramos-lissajous.html      ← Punto de entrada HTML (Bulma)
            │   ├── style-lissajous.css                    ← CSS complementario (Argentum Sans + layout)
            │   ├── typedoc-ull-theme.css                  ← CSS inyectado en TypeDoc (tema ULL)
            │   ├── lissajous-client.ts                    ← Punto de entrada TypeScript (main)
            │   │
            │   ├── interfaces/
            │   │   ├── control-binding.ts      ← Enlace DOM ↔ parámetro del modelo
            │   │   ├── controls-limits.ts      ← Rangos [min, max] del panel de controles
            │   │   ├── curve-render-config.ts  ← Color y grosor de la curva
            │   │   ├── grid-config.ts          ← Configuración visual de la cuadrícula
            │   │   ├── lissajous-params.ts     ← Parámetros de la curva + DEFAULT_LISSAJOUS_PARAMS
            │   │   └── lissajous-point.ts      ← Punto normalizado (x, y) ∈ [-1, 1]²
            │   │
            │   ├── model/
            │   │   └── lissajous-model.ts      ← Modelo MVC
            │   │
            │   ├── view/
            │   │   ├── lissajous-view.ts       ← Vista MVC (Facade)
            │   │   ├── grid-renderer.ts        ← Cuadrícula de fondo (dos niveles)
            │   │   └── controls/
            │   │       ├── base-controls-group.ts       ← Clase abstracta (number + range)
            │   │       ├── controls-panel.ts            ← Facade del panel (+ checkbox)
            │   │       ├── numeric-controls-panel.ts    ← inputs type="number"
            │   │       └── slides-controls-panel.ts     ← inputs type="range"
            │   │
            │   ├── controller/
            │   │   └── lissajous-controller.ts ← Controlador MVC
            │
            └── uml/
                ├── lissajous.mmd               ← Diagrama de clases Mermaid
                ├── uml.ts                      ← Carga el .mmd en la página UML
                ├── uml.html
                └──  uml-style.css

```

---

## Clases e interfaces

### Interfaces

| Fichero | Símbolo | Descripción |
|---------|---------|-------------|
| `lissajous-params.ts` | `LissajousParams` | Parámetros completos de la curva + `DEFAULT_LISSAJOUS_PARAMS` |
| `lissajous-point.ts` | `LissajousPoint` | Punto (x, y) normalizado en [-1, 1]² |
| `curve-render-config.ts` | `CurveRenderConfig` | Color y grosor de la línea + `DEFAULT_CURVE_RENDER_CONFIG` |
| `grid-config.ts` | `GridConfig` | Configuración visual de la cuadrícula + `DEFAULT_GRID_CONFIG` |
| `controls-limits.ts` | `ControlsLimits` | Rangos [min, max] del panel + `DEFAULT_CONTROLS_LIMITS` |
| `control-binding.ts` | `ControlBinding` | Enlace entre un elemento del DOM y una propiedad del modelo |

### Clases

| Fichero | Clase | Capa | Responsabilidad |
|---------|-------|------|-----------------|
| `lissajous-model.ts` | `LissajousModel` | Modelo | Almacena parámetros, calcula puntos y gestiona la animación del desfase |
| `lissajous-view.ts` | `LissajousView` | Vista | Facade: renderiza canvas y delega los controles a `ControlsPanel` |
| `grid-renderer.ts` | `GridRenderer` | Vista | Dibuja la cuadrícula de fondo con celdas cuadradas de dos niveles |
| `controls-panel.ts` | `ControlsPanel` | Vista | Facade del panel: orquesta grupos numéricos, sliders y checkbox |
| `base-controls-group.ts` | `BaseControlsGroup` | Vista | Clase abstracta: lógica común de controles numéricos (number + range) |
| `numeric-controls-panel.ts` | `NumericInputsGroup` | Vista | Gestiona los `input[type="number"]` del panel |
| `slides-controls-panel.ts` | `SliderInputsGroup` | Vista | Gestiona los `input[type="range"]` del panel |
| `lissajous-controller.ts` | `LissajousController` | Controlador | Conecta modelo y vista; gestiona el bucle RAF y el `ResizeObserver` |

---

## Patrones de diseño aplicados

| Patrón | Clase(s) | Propósito |
|--------|----------|-----------|
| **MVC** | `LissajousModel`, `LissajousController`, `LissajousView` | Separación de datos, lógica de negocio y presentación |
| **Facade** | `LissajousView`, `ControlsPanel` | Punto de entrada único a subsistemas complejos (canvas y controles) |
| **Observer** | `ControlsPanel.onParamChange` | Notificación de cambios del usuario al controlador sin acoplamiento directo |

---

## Principios SOLID

| Principio | Aplicación |
|-----------|------------|
| **SRP** | Cada clase tiene una única responsabilidad: `GridRenderer` solo dibuja la cuadrícula; `NumericInputsGroup` solo gestiona `input[type="number"]`; etc. |
| **OCP** | Nuevas configuraciones de cuadrícula o curva se pasan mediante objetos parciales (`Partial<GridConfig>`) sin modificar las clases existentes |
| **DIP** | El controlador recibe modelo y vista por inyección de dependencias en el constructor; `BaseControlsGroup` abstrae la lógica de cualquier control numérico |

---

## Instalación y ejecución

```bash
npm install
npm run build        # compila todo el proyecto (tsc desde la raíz)
npm run dev:server   # arranca el servidor en http://localhost:8080
```

Para regenerar la documentación TypeDoc:

```bash
npm run docs
```

---

## Bulma CSS

La interfaz usa **Bulma** como framework CSS base, instalado como dependencia del proyecto:

```bash
npm install bulma
```

Se carga desde CDN para evitar rutas relativas complejas:

```html
<link rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bulma@1.0.2/css/bulma.min.css" />
```

El fichero `style-lissajous.css` importa la fuente corporativa ULL **Argentum Sans** y añade únicamente lo que Bulma no cubre: layout del canvas, panel de controles y la identidad de color ULL (`#5C068C`).

---

## TypeDoc — tema ULL

El fichero `typedoc-ull-theme.css` se inyecta sobre el tema por defecto de TypeDoc mediante la opción `customCss` del `typedoc.json`. Aplica:

- Fuente corporativa **Argentum Sans**
- Header y footer en morado ULL (`#5C068C`)
- Enlaces en azul ULL (`#006699`)
- Links de navegación hacia el índice, la aplicación y el diagrama UML

---

## URLs de la aplicación

| Página | URL |
|--------|-----|
| Índice | `http://localhost:8080/index.html` |
| Aplicación | `http://localhost:8080/alvaro-perez-ramos-lissajous.html` |
| Diagrama UML | `http://localhost:8080/uml.html` |
| TypeDoc | `http://localhost:8080/docs/index.html` |

---

## Referencias

- <https://es.wikipedia.org/wiki/Curva_de_Lissajous>
- <https://academo.org/demos/lissajous-curves/>
- <https://www.epsilones.com/paginas/articulos/articulos-005-lissajous.html>
- <https://bulma.io/documentation/>
- <https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API>
- <https://www.typescriptlang.org/docs/>
- <https://typedoc.org/>
- <https://eslint.org/>
- <https://www.ull.es/portal/marca/tipografia/>

---



## Navbar — justificación del uso de Flexbox

El navbar de la aplicación y del diagrama UML usa un contenedor `<nav class="site-nav">` con
`display: flex` en lugar de la estructura `navbar-brand` + `navbar-menu` de Bulma.

### Por qué no se usa la estructura de Bulma

El componente `navbar` de Bulma define `display: none` sobre `.navbar-menu` en viewports
inferiores a 1024px. Su comportamiento esperado es que un *burger button* añada la clase
`.is-active` por JavaScript para mostrar el menú. Sin ese JavaScript, los enlaces de
navegación desaparecen en cualquier ventana más estrecha que 1024px — exactamente la mitad
de una pantalla estándar de escritorio.

Una alternativa dentro del propio framework sería aplicar la clase utilitaria `is-flex`
sobre `.navbar-menu`, que sobreescribe `display: none` al tener mayor especificidad:

```css
/* Bulma base (mobile) */
.navbar-menu         { display: none; }

/* Clase utilitaria — especificidad superior */
.navbar-menu.is-flex { display: flex; }
```

Sin embargo, este enfoque mezcla clases de estructura del framework con clases utilitarias
que contradicen su comportamiento base, lo que genera una dependencia implícita de los
detalles internos de Bulma. Cualquier actualización de versión que modifique la especificidad
de `.navbar-menu` o su modelo de colapso podría romper el resultado de forma silenciosa.

### Solución adoptada: contenedor Flexbox independiente

Se sustituye la estructura de Bulma por un `<nav class="site-nav">` con CSS propio,
siguiendo nomenclatura BEM, cuyo comportamiento no depende del framework:

```css
.site-nav {
  display: flex;
  align-items: center;            /* alineación vertical de brand y enlaces */
  justify-content: space-between; /* brand a la izquierda, enlaces a la derecha */
}
```

### Por qué Flexbox y no otra propiedad de layout

| Alternativa | Motivo de descarte |
|-------------|-------------------|
| `float` | Requiere técnicas de limpieza de flujo (*clearfix*); no proporciona alineación vertical directa; considerado obsoleto para layouts |
| `position: absolute` en los enlaces | Extrae los elementos del flujo normal del documento; el contenedor pierde su altura natural |
| `display: inline-block` | No ofrece distribución de espacio entre grupos ni alineación vertical sin valores de `vertical-align` adicionales |
| CSS Grid | Adecuado para layouts bidimensionales; para una única fila con dos grupos resulta semánticamente sobredimensionado |

Flexbox es el modelo de layout de CSS diseñado para la distribución de elementos en **un
único eje**. Para un navbar de una sola fila con dos grupos de contenido, expresa la
intención del layout de forma directa y sin efectos secundarios sobre el resto del documento.

### Coherencia con TypeDoc

El resultado es visualmente equivalente a los `navigationLinks` generados por TypeDoc, que
también renderiza su barra de navegación con un `<header>` de flexbox plano. Las tres páginas
de la práctica (aplicación, UML y documentación) comparten así el mismo sistema de
navegación, lo que refuerza la coherencia visual del conjunto.

---
## Licencia

MIT License