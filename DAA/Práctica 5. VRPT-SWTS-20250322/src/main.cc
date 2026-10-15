/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Diseño y Análisis de Algoritmos
 * Práctica 5: VRPT-SWTS
 *
 * @file main.cc
 * @brief Implementación de la función principal del programa
 * @version 1.3
 * @author Álvaro Pérez Ramos - alu0101574042@ull.edu.es
 * @date 22/03/2025
 */
#include "../includes/mainFunctions.h"

/**
 * @brief Main function
 */
int main(int argc, char* argv[]) {

  // Procesar argumentos de línea de comandos
  program_options options = process_arguments(argc, argv);
  if (options.help) {
    print_help();
    return 0;
  }

  // Procesar argumentos de salida
  auto [output_stream, file_stream] = process_output_stream(argc, argv);
  std::ostream& os = *output_stream;

  os << "\n========================================\n";
  os << "          PROYECTO DAA - PRÁCTICA 5\n";
  os << "========================================\n";

  SummaryReporter reporter;
  auto start_time = std::chrono::high_resolution_clock::now();

  try {
    if (options.batch_mode) {
      if (options.batch_directory.empty()) {
        std::cerr << "Error: Please specify directory for batch processing\n";
        print_help();
        return 1;
      }

      process_batch(options.batch_directory, reporter, os, options.information);
    } else {
      if (options.input_file.empty()) {
        std::cerr << "Error: Please specify input file\n";
        print_help();
        return 1;
      }
      process_single_file(options.input_file, reporter, os, options.information);
    }
  } catch (const std::exception& e) {
    std::cerr << "Error: " << e.what() << "\n";
    return 1;
  }

  auto end_time = std::chrono::high_resolution_clock::now();
  double total_time =
      std::chrono::duration<double>(end_time - start_time).count();

  os << "\nTiempo total de ejecución: " << total_time << " segundos\n";
  reporter.generate_summary_report(os);

  return 0;
}
