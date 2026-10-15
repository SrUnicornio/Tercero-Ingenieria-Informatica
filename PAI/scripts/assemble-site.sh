#!/usr/bin/env bash
#
# Universidad de La Laguna
# Escuela Superior de Ingeniería y Tecnología
# Grado en Ingeniería Informática
# Programación de Aplicaciones Interactivas
#
# @file assemble-site.sh
# @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
# @since  October 2026
# @description Compone el directorio _site/ que se publica en GitHub Pages.
#   Se ejecuta desde la raíz del monorepo. Espera que los bundles de las
#   prácticas Vite ya estén descargados en _artifacts/site-<slug>/.
#   Puede ejecutarse en local para revisar el resultado antes de hacer push.

set -euo pipefail

readonly PRACTICES_DIR="practicas"
readonly ARTIFACTS_DIR="_artifacts"
readonly SITE_DIR="_site"

rm -rf "${SITE_DIR}"
mkdir -p "${SITE_DIR}"

# ── Funciones auxiliares ─────────────────────────────────────

# Copia una carpeta de documentación TypeDoc ya generada a _site/<slug>/docs/.
#   $1: ruta de la documentación dentro de practicas/
#   $2: slug público de la práctica (subdirectorio de la URL)
copyDocumentation() {
  local documentationSource="${PRACTICES_DIR}/$1"
  local publicSlug="$2"

  if [[ ! -f "${documentationSource}/index.html" ]]; then
    echo "ERROR: no existe ${documentationSource}/index.html" >&2
    exit 1
  fi
  mkdir -p "${SITE_DIR}/${publicSlug}/docs"
  cp -r "${documentationSource}/." "${SITE_DIR}/${publicSlug}/docs/"
  echo "  docs  → /${publicSlug}/docs/"
}

# ── 1. Prácticas Vite (P12–P14): bundles generados en build-vite ──
echo "Prácticas Vite:"
if compgen -G "${ARTIFACTS_DIR}/site-*" > /dev/null; then
  for artifactDirectory in "${ARTIFACTS_DIR}"/site-*/; do
    artifactName="$(basename "${artifactDirectory}")"
    publicSlug="${artifactName#site-}"
    mkdir -p "${SITE_DIR}/${publicSlug}"
    cp -r "${artifactDirectory}." "${SITE_DIR}/${publicSlug}/"
    echo "  app   → /${publicSlug}/"
  done
else
  echo "  (sin artefactos en ${ARTIFACTS_DIR}/: se omiten P12–P14)"
fi

# ── 2. P01: HTML/JS estático, se publica tal cual ─────────────
echo "Estáticas:"
readonly P01_SLUG="p01-devenvironment"
mkdir -p "${SITE_DIR}/${P01_SLUG}"
cp -r "${PRACTICES_DIR}/25-26-pai-p01-devenvironment-AlvaroPerezRamos/www/." \
      "${SITE_DIR}/${P01_SLUG}/"
# bouncingBalls no tiene index.html: se duplica para que /bouncingBalls/ funcione.
cp "${SITE_DIR}/${P01_SLUG}/bouncingBalls/bouncingBalls.html" \
   "${SITE_DIR}/${P01_SLUG}/bouncingBalls/index.html"
echo "  app   → /${P01_SLUG}/computePI/ y /${P01_SLUG}/bouncingBalls/"

# ── 3. Documentación versionada (P06–P11) ─────────────────────
echo "Documentación:"
copyDocumentation "25-26-pai-p06-oodesign-AlvaroPerezRamos/docs" \
                  "p06-oodesign"
copyDocumentation "25-26-pai-p07-canvas2-AlvaroPerezRamos/docs" \
                  "p07-canvas2"
copyDocumentation "25-26-pai-p08-json-data-visualization-AlvaroPerezRamos/docs" \
                  "p08-json-data-visualization"
copyDocumentation "25-26-pai-p09-canvasapi2-AlvaroPerezRamos/src/exercises/home-work/docs" \
                  "p09-canvasapi2"
copyDocumentation "25-26-pai-p10-mvc-events-projectile-AlvaroPerezRamos/src/exercises/home-work/docs" \
                  "p10-projectile"
copyDocumentation "25-26-pai-p11-mvc-events-lissajous-AlvaroPerezRamos/src/exercises/home-work/docs" \
                  "p11-lissajous"

# ── 4. Portal de la raíz ──────────────────────────────────────
if [[ ! -f portal/index.html ]]; then
  echo "ERROR: falta portal/index.html" >&2
  exit 1
fi
cp -r portal/. "${SITE_DIR}/"
echo "Portal → /"

# Desactiva Jekyll por si alguna vez se publica desde rama.
touch "${SITE_DIR}/.nojekyll"

echo "Sitio compuesto en ${SITE_DIR}/"