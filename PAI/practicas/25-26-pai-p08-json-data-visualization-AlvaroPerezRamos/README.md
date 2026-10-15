[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/NZ8xYbzw)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=23154482&assignment_repo_type=AssignmentRepo)

# Práctica 8 — JSON Data Visualization

**Asignatura:** Programación de Aplicaciones Interactivas  
**Autor:** Álvaro Pérez Ramos — alu0101574042@ull.edu.es  
**Grado en Ingeniería Informática — Universidad de La Laguna**

---

## Descripción

Aplicación web que obtiene datos de población de los países europeos
desde la API pública [restcountries.com](https://restcountries.com) y los
representa gráficamente en un diagrama de barras dibujado con la **API Canvas
de HTML5** y programado en **TypeScript**.

El servidor Express actúa de proxy hacia `restcountries.com` para evitar
restricciones CORS, y sirve la aplicación compilada junto con la documentación
TypeDoc y el diagrama UML.

---

## Estructura del proyecto

```
.
├── src/
│   ├── home-work/
│   │   └── bar-chart/
│   │       ├── bar-chart.ts          # Lógica: interfaces, adapter, BarChart
│   │       ├── bar-chart-client.ts   # Punto de entrada: AppController + main
│   │       ├── bar-chart.js          # JS compilado
│   │       ├── bar-chart-client.js   # JS compilado
│   │       ├── alvaro-perez-ramos-bar-chart.html
│   │       └── bar-chart-style.css
│   └── UML/
│       └── bar-chart/
│           ├── bar-chart.mmd         # Diagrama UML en Mermaid
│           ├── uml.ts                # Carga y renderiza el .mmd
│           ├── uml.js                # JS compilado
│           ├── uml.html              # Página con diagrama UML
│           └── uml-style.css
├── web-server/
│   └── app.js                        # Servidor Express
├── www/
│   ├── index.html                    # Página índice
│   └── server-style.css
├── docs/                             # Documentación generada con TypeDoc
├── read-JSON-app/                    # Aplicación de ejemplo del enunciado
├── eslint.config.mjs
├── tsconfig.json
├── typedoc.json
└── package.json
```

---

## Instalación y ejecución

```bash
npm install
tsc                    # Compila bar-chart.ts, bar-chart-client.ts y uml.ts
npm run webSv          # Inicia el servidor en http://localhost:8080
```

---

## Páginas disponibles

| URL | Contenido |
|-----|-----------|
| `http://localhost:8080/` | Página índice |
| `http://localhost:8080/alvaro-perez-ramos-bar-chart.html` | Gráfico de barras |
| `http://localhost:8080/uml.html` | Diagrama UML |
| `http://localhost:8080/docs` | Documentación TypeDoc |
| `http://localhost:8080/data` | Endpoint JSON (proxy restcountries.com) |

---

## Fuente de datos

[restcountries.com v3.1](https://restcountries.com/v3.1/region/europe?fields=name,population)
— API pública, sin autenticación, devuelve nombre y población de todos
los países europeos en formato JSON.

---

## Clases e interfaces

### Interfaces de datos externos (`restcountries.com`)
- **`RCName`** — nombre común y oficial del país.
- **`RCCountry`** — país con su nombre y población.
- **`RCResponse`** — alias de `RCCountry[]`, raíz de la respuesta.

### Modelo interno
- **`TimeSeriesPoint`** — par año/valor de una serie temporal.
- **`DataItem`** — elemento listo para renderizar: etiqueta, valor y serie.
- **`DataAdapter`** — interfaz que define el contrato de transformación.

### Clases principales
- **`RestCountriesAdapter`** — implementa `DataAdapter`, transforma
  `RCCountry[]` en `DataItem[]` ordenados por población descendente.
- **`DataService`** — hace fetch al endpoint y delega la transformación.
- **`BarChart`** — dibuja el gráfico completo en un canvas HTML5.
  Expone únicamente el método público `draw(data)`.
- **`AppController`** — coordina `DataService` y `BarChart`.

### Constantes de `BarChart`
| Constante | Valor | Descripción |
|-----------|-------|-------------|
| `MILLION` | 1 000 000 | Umbral M vs K en etiquetas de barras |
| `THOUSAND` | 1 000 | Divisor para valores en miles |
| `MAX_LABEL_LENGTH` | 12 | Máx. caracteres en etiqueta eje X |
| `X_LABEL_OFFSET` | 10 px | Separación vertical etiquetas eje X |
| `X_LABEL_ROTATION` | π/4 rad | Ángulo de rotación etiquetas eje X |
| `BAR_PADDING_RATIO` | 0.15 | Proporción de padding lateral de barra |
| `BAR_VALUE_Y_OFFSET` | 4 px | Separación valor encima de barra |
| `Y_LABEL_X_OFFSET` | 8 px | Separación horizontal ticks eje Y |
| `Y_LABEL_Y_OFFSET` | 3 px | Ajuste vertical ticks eje Y |
| `Y_AXIS_LABEL_OFFSET` | 55 px | Distancia etiqueta título eje Y |

---

## Patrones de diseño aplicados

- **Adapter** — `RestCountriesAdapter` transforma la respuesta externa
  al modelo interno `DataItem`.
- **Service Layer** — `DataService` encapsula la lógica de obtención
  de datos remotos.
- **Controller** — `AppController` coordina servicio y vista
  (MVC simplificado).
- **DIP** — `DataService` depende de la interfaz `DataAdapter`,
  no de la implementación concreta.

---

## Herramientas

- TypeScript 5 + ts-node
- ESLint con Google Style Guide
- TypeDoc
- Jest
- Express + LiveReload
- Mermaid.js (renderizado UML en navegador)