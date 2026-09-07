/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Inteligencia Artifical
 * Curso: 3º
 * Práctica 2: Busqueda A*
 * Autor: Álvaro Pérez Ramos
 * Correo: alu0101574042@ull.edu.es
 * Fecha: 18/09/2024
 * Archivo busqueda_informada_main.cc: programa principal
 */
#include "busqueda_informada.h"

int main(int argc, char *argv[]) {
  Usage(argc, argv);

  int rows, cols;
  Laberinto laberinto(0, 0);
  if (!LoadLaberinto(argv[1], laberinto, rows, cols))
  {
    return 1;
  }

  WriteLaberintoToFile(laberinto, "Laberinto.txt");
  // Encontrar las posiciones de inicio y fin
  Position start, end;
  if (!FindStartAndEnd(laberinto, start, end))
  {
    return 1;
  }
  
  // Mostrar el menú para cambiar las posiciones de inicio y fin
  if (CambiarPosiciones(start, end, laberinto))
  {
    // Escribir el laberinto actualizado
    WriteLaberintoToFile(laberinto, "Laberinto.txt");
  }

  std::ofstream output_info("Laberinto_info_Manhattan.txt");
  output_info << "Start: (" << start.first + 1 << ", " << start.second + 1 << ")\n";
  output_info << "End: (" << end.first + 1 << ", " << end.second + 1 << ")\n";
  output_info << "Manhattan h(n): " << heuristicManhattan(start, end) << std::endl;

  // Crear una instancia del solucionador A*
  AStarSolver solver(laberinto, start, end, output_info);
  std::vector<Position> path;
  std::vector<Direction> directions_path;

  solver.solve(path, directions_path);
  
  output_info.close();
  path.clear();
  directions_path.clear();

  output_info.open("Laberinto_info_Euclidean.txt");
  output_info << "Start: (" << start.first + 1 << ", " << start.second + 1 << ")\n";
  output_info << "End: (" << end.first + 1 << ", " << end.second + 1 << ")\n";
  output_info << "Euclidean h(n): " << heuristicEuclidean(start, end) << std::endl;

  // Crear una instancia del solucionador A*
  AStarSolver solver2(laberinto, start, end, output_info);

  solver2.solve2(path, directions_path);

  output_info.close();
  return 0;
}
