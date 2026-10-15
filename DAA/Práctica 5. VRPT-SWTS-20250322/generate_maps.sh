#!/bin/bash

# Directorio de entrada
INPUT_DIR=$1

# Verificar que se ha pasado un argumento
if [ -z "$INPUT_DIR" ]; then
    echo "Uso: $0 <directorio_de_entrada> [directorio_de_salida]"
    exit 1
fi

# Verificar que el directorio existe
if [ ! -d "$INPUT_DIR" ]; then
    echo "Error: El directorio $INPUT_DIR no existe."
    exit 1
fi

# Crear una lista de archivos asegurando que no haya problemas con espacios
mapfile -t FILES < <(find "$INPUT_DIR" -type f -name "*.txt")

# Verificar que haya archivos
if [ ${#FILES[@]} -eq 0 ]; then
    echo "Error: No hay archivos .txt en $INPUT_DIR"
    exit 1
fi

# Directorio de salida (opcional)
OUTPUT_DIR=${2:-"${INPUT_DIR}/output"}
mkdir -p "$OUTPUT_DIR"

# Procesar cada archivo con Gnuplot
for file in "${FILES[@]}"; do
    echo "Procesando archivo: $file"
    
    # Nombre del archivo de salida
    filename=$(basename "$file" .txt)
    output_file="${OUTPUT_DIR}/${filename}.png"
    
    # Ejecutar Gnuplot
    gnuplot -c plot_map.gp "$file" "$output_file"
done

echo "Procesamiento completado. Los gráficos se han guardado en: $OUTPUT_DIR"