/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Diseño y Análisis de Algoritmos
 * Práctica 6: Branch and Bound
 *
 * @file main.cc
 * @brief This file contains the main function for the program.
 *
 * @author 
 * @date 24 APR 2025
 */

#include "../include/main-functions.h"

int main(int argc, char* argv[]) {
  try {
    ArgumentParser parser(argc, argv);
    ProgramOptions options = parser.parse();

    if (options.help) {
      print_help(argv[0], std::cout);
      return 0;
    }

    auto [output_stream, file_stream] = process_output_stream(argc, argv);
    std::ostream& os = *output_stream;

    ResultTable greedy_table(
        {"Problema", "n", "K", "m", "cost", "subset", "CPU_time"});
    ResultTable grasp_table({"Problema", "n", "K", "m", "Iterations", "[LRC]",
                             "cost", "subset", "CPU_time"});
    ResultTable local_search_table(
        {"Problema", "n", "K", "m", "cost", "subset", "CPU_time"});
    ResultTable bnb_table({"Problema", "n", "K", "m", "cost", "subset",
                           "CPU_time", "nodes_generated"});
    ResultTables tables = {greedy_table, grasp_table, local_search_table,
                           bnb_table};
    if (options.batch_mode) {
      process_batch(options, tables, os);
    } else if (options.single_file_mode) {
      process_single(options, tables, os);
    } else {
      print_help(argv[0], os);
      return 1;
    }

    os << "\n========================================\n";
    os << "Greedy Algorithm Results:\n";
    os << tables.greedy_table;
    os << "========================================\n";
    os << "GRASP Algorithm Results:\n";
    os << tables.grasp_table;
    os << "========================================\n";
    os << "Local Search Algorithm Results:\n";
    os << tables.local_search_table;
    os << "========================================\n";
    os << "Branch and Bound Algorithm Results:\n";
    os << tables.branch_and_bound_table;
    os << "========================================\n";

  } catch (const std::exception& e) {
    std::cerr << "\nError: " << e.what() << "\n\n";
    print_help(argv[0], std::cerr);
    return 1;
  }

  return 0;
}
