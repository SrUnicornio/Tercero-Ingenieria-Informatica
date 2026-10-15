# Configuración de terminal
set terminal pngcairo size 1200,900 enhanced font 'Verdana,12'
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

# Preprocesamiento de datos (todos los puntos y solución por separado)
problem_file = "temp_3d_problem.dat"
solution_file = "temp_3d_solution.dat"

if (has_solution == 1) {
    system(sprintf("sed -n '3,%dp' '%s' > '%s'", solution_start-2, input_file, problem_file))
    system(sprintf("sed -n '%d,$p' '%s' > '%s'", solution_start, input_file, solution_file))
} else {
    system(sprintf("tail -n +3 '%s' > '%s'", input_file, problem_file))
}

# Configurar separador decimal para usar comas
set decimalsign ','

# Rango de los ejes
stats problem_file using 1 nooutput
x_min = STATS_min
x_max = STATS_max

stats problem_file using 2 nooutput
y_min = STATS_min
y_max = STATS_max

stats problem_file using 3 nooutput
z_min = STATS_min
z_max = STATS_max

# Márgenes
margin = 0.1
x_range = x_max - x_min
y_range = y_max - y_min
z_range = z_max - z_min

# Configuración del gráfico
if (has_solution == 1) {
    # Contar líneas en el archivo solution
    solution_points = system(sprintf("wc -l < '%s'", solution_file)) + 0
    set title sprintf("Distribución de %s puntos en 3D con solución de %d puntos", num_points, solution_points)
} else {
    set title sprintf("Distribución de %s puntos en 3D", num_points)
}

set xlabel "Coordenada X" offset 0,-1
set ylabel "Coordenada Y" offset 3,0
set zlabel "Coordenada Z" rotate by 90 offset -3,0
set grid xtics ytics ztics
set view 65, 45, 1.2, 1.2
set xyplane at z_min
set key top right box opaque

# Estilos para los puntos y líneas
set style line 1 lc rgb 'grey' pt 7 ps 1       # Puntos originales
set style line 2 lc rgb 'blue' pt 7 ps 1.5     # Puntos solución
set style line 3 lc rgb 'red' lw 2             # Líneas solución
set style line 4 lc rgb '#dddddd' lw 0.5 lt 1  # Líneas proyección

# Rangos con márgenes
set xrange [x_min-margin*x_range:x_max+margin*x_range]
set yrange [y_min-margin*y_range:y_max+margin*y_range]
set zrange [z_min-margin*z_range:z_max+margin*z_range]

# Graficar puntos y solución
if (has_solution == 1) {
    splot problem_file using 1:2:3 with points ls 1 title 'Puntos problema', \
          problem_file using 1:2:3:(sprintf("%d", $0+1)) with labels offset 1,1,1 notitle, \
          solution_file using 1:2:3 with points ls 2 title 'Puntos solución', \
          solution_file using 1:2:3 with lines ls 3 title 'Conexiones solución', \
          problem_file using 1:2:(z_min-margin*z_range):(0):(0):(z_range*(1+2*margin)) with vectors nohead ls 4 notitle, \
          problem_file using 1:(y_min-margin*y_range):3:(0):(y_range*(1+2*margin)):(0) with vectors nohead ls 4 notitle, \
          problem_file using (x_min-margin*x_range):2:3:(x_range*(1+2*margin)):(0):(0) with vectors nohead ls 4 notitle
} else {
    splot problem_file using 1:2:3 with points ls 1 title 'Puntos problema', \
          problem_file using 1:2:3:(sprintf("%d", $0+1)) with labels offset 1,1,1 notitle, \
          problem_file using 1:2:(z_min-margin*z_range):(0):(0):(z_range*(1+2*margin)) with vectors nohead ls 4 notitle, \
          problem_file using 1:(y_min-margin*y_range):3:(0):(y_range*(1+2*margin)):(0) with vectors nohead ls 4 notitle, \
          problem_file using (x_min-margin*x_range):2:3:(x_range*(1+2*margin)):(0):(0) with vectors nohead ls 4 notitle
}

# Limpieza
system(sprintf("rm -f '%s' '%s'", problem_file, solution_file))