# Configuración de terminal
set terminal pngcairo size 800,600 enhanced font 'Verdana,10'
set encoding utf8

# Argumentos: archivo de entrada y salida
input_file = ARG1
output_file = ARG2
set output output_file

# Detectar si hay solución
has_solution = system(sprintf("grep -q '^Solution:' '%s' && echo 1 || echo 0", input_file)) + 0
solution_start = has_solution == 1 ? system(sprintf("grep -n '^Solution:' '%s' | cut -d: -f1", input_file)) + 1 : 0

# Leer número de puntos
num_points = system(sprintf("head -1 '%s' | tr -d '\\n'", input_file))

# Configuración del gráfico
if (has_solution == 1) {
    solution_points = system(sprintf("wc -l < '%s'", input_file)) - solution_start + 1
    set title sprintf("Distribución de %s puntos en 2D con solución de %d puntos", num_points, solution_points)
} else {
    set title sprintf("Distribución de %s puntos en 2D", num_points)
}

set xlabel "Coordenada X"
set ylabel "Coordenada Y"
set grid
set key outside bottom center box

# Estilos para los puntos y líneas
set style line 1 lc rgb 'grey' pt 7 ps 1      # Puntos originales
set style line 2 lc rgb 'blue' pt 7 ps 1.5        # Puntos solución
set style line 3 lc rgb 'red' lw 2               # Líneas solución

# Preprocesamiento de datos (todos los puntos y solución por separado)
problem_file = "temp_2d_problem.dat"
solution_file = "temp_2d_solution.dat"

if (has_solution == 1) {
    system(sprintf("sed -n '3,%dp' '%s' > '%s'", solution_start-2, input_file, problem_file))
    system(sprintf("sed -n '%d,$p' '%s' > '%s'", solution_start, input_file, solution_file))
} else {
    system(sprintf("tail -n +3 '%s' > '%s'", input_file, problem_file))
}

# Configurar separador decimal para usar comas
set decimalsign ','

# Rango de los ejes
stats problem_file using 1:2 nooutput
x_min = STATS_min_x - 0.5
x_max = STATS_max_x + 0.5
y_min = STATS_min_y - 0.5
y_max = STATS_max_y + 0.5
set xrange [x_min:x_max]
set yrange [y_min:y_max]

# Graficar puntos y solución
if (has_solution == 1) {
    plot problem_file using 1:2 with points ls 1 title 'Puntos problema', \
         problem_file using 1:2:(sprintf("%d", $0+1)) with labels offset 0.5,0.5 notitle, \
         solution_file using 1:2 with points ls 2 title 'Puntos solución', \
         solution_file using 1:2 with linespoints ls 3 title 'Conexiones solución'
} else {
    plot problem_file using 1:2 with points ls 1 title 'Puntos problema', \
         problem_file using 1:2:(sprintf("%d", $0+1)) with labels offset 0.5,0.5 notitle
}

# Limpieza
system(sprintf("rm -f '%s' '%s'", problem_file, solution_file))