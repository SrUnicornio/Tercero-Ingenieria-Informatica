# Configuración de terminal
set terminal pngcairo size 800,600 enhanced font 'Verdana,10'

# Argumentos: archivo de entrada y salida
input_file = ARG1
output_file = ARG2
set output output_file

print "Procesando archivo: ".input_file." -> ".output_file

# Función para extraer coordenadas por ID
get_coords(id) = system(sprintf("awk '$4 == \"%s\" {print $1, $2}' '%s'", id, input_file))

# Detección y procesamiento de rutas
has_routes = 0
has_transport_routes = 0
route_data_file = "temp_route_data.dat"
transport_route_data_file = "temp_transport_route_data.dat"

# Buscar si hay líneas de ruta
stats input_file using (strcol(1) eq "Route:" ? (has_routes=1, 1/0) : 0) nooutput
stats input_file using (strcol(1) eq "Transport" && strcol(2) eq "Route:" ? (has_transport_routes=1, 1/0) : 0) nooutput

# Configuración del gráfico
set title "Mapa de Zonas de Recolección, Puntos Clave y Rutas"
set xlabel "Coordenada X"
set ylabel "Coordenada Y"
set grid
set key outside

# Estilos para los puntos
set style line 1 lc rgb 'red' pt 12 ps 3    # Depot
set style line 2 lc rgb 'blue' pt 7 ps 1.5  # IF
set style line 3 lc rgb 'yellow' pt 15 ps 3 # Dumpsite
set style line 4 lc rgb 'purple' pt 20 ps 1.5 # Zones

# Rango de los ejes
set xrange [0:20]
set yrange [0:60]

# Comando base del plot
plot_cmd = "plot '".input_file."' using (strcol(3) eq \"Depot\" ? \$1 : NaN):(strcol(3) eq \"Depot\" ? \$2 : NaN) with points ls 1 title \"Depot\", \
     '' using (strcol(3) eq \"IF\" ? \$1 : NaN):(strcol(3) eq \"IF\" ? \$2 : NaN) with points ls 2 title \"IF\", \
     '' using (strcol(3) eq \"IF\" ? \$1 : NaN):(strcol(3) eq \"IF\" ? \$2 : NaN):4 with labels offset 0.5,0.5 notitle, \
     '' using (strcol(3) eq \"Dumpsite\" ? \$1 : NaN):(strcol(3) eq \"Dumpsite\" ? \$2 : NaN) with points ls 3 title \"Dumpsite\", \
     '' using (strstrt(strcol(3), \"Zone\") ? \$1 : NaN):(strstrt(strcol(3), \"Zone\") ? \$2 : NaN) with points ls 4 title \"Zones\", \
     '' using (strstrt(strcol(3), \"Zone\") ? \$1 : NaN):(strstrt(strcol(3), \"Zone\") ? \$2 : NaN):4 with labels offset 0.5,0.5 notitle"

# Procesamiento de rutas de recolección
if (has_routes) {
    print "El archivo contiene rutas de recolección - procesando..."
    
    # Extraer líneas de ruta
    system(sprintf("grep '^Route:' '%s' | sed 's/^Route: //' > '%s'", input_file, route_data_file))
    route_count = system(sprintf("wc -l < '%s'", route_data_file)) + 0
    print "Número de rutas de recolección encontradas: ", route_count

    do for [i=1:route_count] {
        route_line = system(sprintf("awk 'NR==%d' '%s'", i, route_data_file))
        route_coords_file = sprintf("temp_route_coords_%d.dat", i)
        system(sprintf("> '%s'", route_coords_file))

        do for [j=1:words(route_line)] {
            id = word(route_line, j)
            coords = get_coords(id)
            if (strlen(coords) > 0) {
                system(sprintf("echo '%s' >> '%s'", coords, route_coords_file))
            }
        }
        system(sprintf("echo '' >> '%s'", route_coords_file))

        # Color aleatorio para rutas de recolección (línea continua)
        r = int(rand(0)*256)
        g = int(rand(0)*256)
        b = int(rand(0)*256)
        color = sprintf("#%02X%02X%02X", r, g, b)
        style_id = i + 10

        eval(sprintf("set style line %d lc rgb '%s' lw 2 dt 1", style_id, color))
        plot_cmd = plot_cmd.sprintf(", '%s' using 1:2 with lines ls %d title 'Ruta recolección %d'", route_coords_file, style_id, i)
    }
}

# Procesamiento de rutas de transporte
if (has_transport_routes) {
    print "El archivo contiene rutas de transporte - procesando..."
    
    # Extraer líneas de ruta de transporte
    system(sprintf("grep '^Transport Route:' '%s' | sed 's/^Transport Route: //' > '%s'", input_file, transport_route_data_file))
    transport_route_count = system(sprintf("wc -l < '%s'", transport_route_data_file)) + 0
    print "Número de rutas de transporte encontradas: ", transport_route_count

    do for [i=1:transport_route_count] {
        route_line = system(sprintf("awk 'NR==%d' '%s'", i, transport_route_data_file))
        route_coords_file = sprintf("temp_transport_route_coords_%d.dat", i)
        system(sprintf("> '%s'", route_coords_file))

        do for [j=1:words(route_line)] {
            id = word(route_line, j)
            coords = get_coords(id)
            if (strlen(coords) > 0) {
                system(sprintf("echo '%s' >> '%s'", coords, route_coords_file))
            }
        }
        system(sprintf("echo '' >> '%s'", route_coords_file))

        # Color aleatorio para rutas de transporte (línea punteada)
        r = int(rand(0)*256)
        g = int(rand(0)*256)
        b = int(rand(0)*256)
        color = sprintf("#%02X%02X%02X", r, g, b)
        style_id = i + 50  # Usamos un rango diferente de style IDs

        eval(sprintf("set style line %d lc rgb '%s' lw 2 dt 2", style_id, color))
        plot_cmd = plot_cmd.sprintf(", '%s' using 1:2 with lines ls %d title 'Ruta transporte %d'", route_coords_file, style_id, i)
    }
}

# Ejecutar el comando de gráfico
eval(plot_cmd)

# Limpieza de archivos temporales
if (has_routes) {
    do for [i=1:route_count] {
        system(sprintf("rm -f 'temp_route_coords_%d.dat'", i))
    }
    system(sprintf("rm -f '%s'", route_data_file))
}

if (has_transport_routes) {
    do for [i=1:transport_route_count] {
        system(sprintf("rm -f 'temp_transport_route_coords_%d.dat'", i))
    }
    system(sprintf("rm -f '%s'", transport_route_data_file))
}