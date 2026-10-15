#!/bin/bash

# Verificar argumentos
if [ $# -ne 2 ]; then
    echo "Uso: $0 <directorio_entrada> <directorio_salida>"
    echo "Ejemplo: $0 solutions/LS/ solution_map/"
    exit 1
fi

INPUT_DIR="$1"
OUTPUT_BASE="$2"

# Crear directorio base de salida
mkdir -p "$OUTPUT_BASE"

# Procesar archivos recursivamente
while IFS= read -r -d '' file; do
    # Obtener ruta relativa
    REL_PATH="${file#$INPUT_DIR}"
    
    # Crear directorio de salida correspondiente
    OUT_DIR="$OUTPUT_BASE/$(dirname "$REL_PATH")"
    mkdir -p "$OUT_DIR"
    
    # Nombre del archivo de salida
    filename=$(basename "$file" .txt)
    output_file="$OUT_DIR/${filename}.png"
    
    echo "Procesando: $file -> $output_file"
    
    # Determinar dimensión
    dim=$(sed -n '2p' "$file" | tr -d '[:space:]')
    
    # Ejecutar Gnuplot
    if [ "$dim" -eq 2 ]; then
        gnuplot -c plot_points_2d.gp "$file" "$output_file"
    elif [ "$dim" -eq 3 ]; then
        gnuplot -c plot_points_3d.gp "$file" "$output_file"
    else
        echo "  Error: Dimensión $dim no soportada"
        continue
    fi
    
    [ $? -eq 0 ] && echo "  -> Generado correctamente"
    
done < <(find "$INPUT_DIR" -type f -name "*.txt" -print0)

echo -e "\nProceso completado. Gráficos generados en: $OUTPUT_BASE"