/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Diseño y Análisis de Algoritmos
 * Práctica 6: Branch and Bound
 *
 * @file main-functions.cc
 * @brief This file contains the implementation of the main functions for the
 * program.
 *
 * @author Álvaro Pérez Ramos - alu0101574042@ull.edu.es
 * @date 24 APR 2025
 */

#include "../include/main-functions.h"

/**
 * @brief Processes the command line arguments and returns the output stream
 *        (cout or file).
 * @param argc Number of command line arguments.
 * @param argv Array of command line arguments.
 * @return A pair containing a pointer to the output stream and a unique_ptr to
 *         the output file stream (if applicable).
 */
coutOrFile process_output_stream(int argc, char* argv[]) {
  std::ostream* output_stream = &std::cout;
  std::unique_ptr<std::ofstream> file_stream;

  for (int i = 1; i < argc; ++i) {
    std::string arg = argv[i];
    if (arg == "-o" || arg == "--output") {
      if (i + 1 >= argc) {
        throw std::runtime_error("Error: Missing filename after " + arg);
      }
      file_stream = std::make_unique<std::ofstream>(argv[i + 1]);
      if (!file_stream->is_open()) {
        throw std::runtime_error("Error: Could not open output file: " +
                                 std::string(argv[i + 1]));
      }
      output_stream = file_stream.get();
      break;
    }
  }

  return {output_stream, std::move(file_stream)};
}

void convert_solution_to_subset(const Solution& solution,
                                std::string& subset_str) {
  std::vector<int> point_numbers;
  // Convert point names to numbers(Point_09->9) std::vector<int> point_numbers;
  for (const auto& point_name : solution.getPointNames()) {
    point_numbers.push_back(
        std::stoi(point_name.substr(point_name.find('_') + 1)));
  }
  std::sort(point_numbers.begin(), point_numbers.end());

  // Create subset string
  for (int num : point_numbers) {
    subset_str += std::to_string(num) + " ";
  }
}

/**
 * @brief Processes a single instance of the problem.
 * @param filename - The name of the file containing the problem data.
 * @param sub_dim - The sub-dimension of the problem.
 * @param table - The ResultTable object to store the results.
 * @param os - The output stream to write the results to.
 * @param information - A boolean flag to indicate whether to print additional
 */
void process_instance(const std::string& filename, const int& sub_dim,
                      ResultTables& table, std::ostream& os, bool information) {
  os << "\n========================================\n";

  bool frist_time = true;
  for (int current_dim = 2; current_dim <= sub_dim; ++current_dim) {
    Problem data(filename, current_dim);

    if (information && frist_time) {
      os << "Instance information:\n";
      os << "Size: " << data.getSize() << "\n";
      os << "Dimension: " << data.getDimension() << "\n";
      os << data << "\n";

      frist_time = false;
    }

    std::string file = filename.substr(filename.find_last_of('/') + 1);

    // Run the algorithm
    greedy_algorithm(data, file, table,
                             os, information);

    // Run the GRASP algorithm
    grasp_algorithm(data, file, table, os,
                    information);

    // Run the Local Search algorithm
    local_search_algoritm(data, file, table, os,
                          information);

    // Run the Branch and Bound algorithm
    bound_and_branch_algorithm(data, file, table,
                               os, information);
  }
}

void pirnt_info(const Problem& data, const std::string& algorithm,
                const double& cpu_time, const Solution& solution,
                std::ostream& os) {
  os << "\n========================================\n";
  os << algorithm << " Algorithm:\n";
  os << "========================================\n";
  os << algorithm << "Solution (m=" << data.getSubDimension() << "):\n";
  os << solution << "\n";
  os << "Total distance: " << Algorithm::CalculateTotalDistance(solution)
     << "\n";
  os << "Execution time: " << cpu_time << " seconds\n";
  os << "========================================\n";
}

void greedy_algorithm(const Problem& data, const std::string& filename,
                      ResultTables& table, std::ostream& os,
                      const bool& information) {
  // Run the algorithm
  Greedy greedy_algorithm;
  Solution solution = greedy_algorithm.Run(data);
  double total_distance = Algorithm::CalculateTotalDistance(solution);
  double cpu_time = greedy_algorithm.getExecutionTime();
  
  // Quitar al filename test/
  std::string sub_dim = std::to_string(data.getSubDimension()) + "_";
  print_solution_to_file("greedy_" + sub_dim + filename, "greedy", solution, data);
  if (information) {
    pirnt_info(data, "Greedy", cpu_time, solution, os);
  }

  std::string subset_str;
  convert_solution_to_subset(solution, subset_str);

  table.greedy_table.add_row({filename, std::to_string(data.getSize()),
                              std::to_string(data.getDimension()),
                              std::to_string(data.getSubDimension()),
                              std::to_string(total_distance), subset_str,
                              std::to_string(cpu_time)});
}

void grasp_algorithm(const Problem& data, const std::string& filename,
                     ResultTables& table, std::ostream& os,
                     const bool& information) {
  for (const auto max_iter : MAX_ITERATIONS) {
    for (const auto lrc : LRC_SIZES) {
      GRASP grasp_algorithm(lrc, max_iter);  // 10 iteraciones, LRC 2-5
      Solution solution = grasp_algorithm.Run(data);
      double total_distance = Algorithm::CalculateTotalDistance(solution);
      double cpu_time = grasp_algorithm.getExecutionTime();

      std::string subset_str;
      convert_solution_to_subset(solution, subset_str);

      // Save the solution to a file
      std::string lrc_str = std::to_string(lrc);
      std::string max_iter_str = std::to_string(max_iter);
      std::string sub_dim =
          std::to_string(data.getSubDimension()) + "_";
      print_solution_to_file(
          "GRASP_" + lrc_str + "_" + max_iter_str + "_" + sub_dim + filename,
          "GRASP", solution, data);
      if (information) {
        pirnt_info(data, "GRASP", cpu_time, solution, os);
      }

      // Add to results table
      table.grasp_table.add_row({filename, std::to_string(data.getSize()),
                                 std::to_string(data.getDimension()),
                                 std::to_string(data.getSubDimension()),
                                 std::to_string(max_iter), std::to_string(lrc),
                                 std::to_string(total_distance), subset_str,
                                 std::to_string(cpu_time)});
    }
  }
}

void local_search_algoritm(const Problem& data, const std::string& filename,
                           ResultTables& table, std::ostream& os,
                           const bool& information) {
  LocalSearch local_search(100);  // 100 iterations
  Solution local_search_solution = local_search.Run(data);
  double local_search_distance =
      Algorithm::CalculateTotalDistance(local_search_solution);
  double local_search_cpu_time = local_search.getExecutionTime();
  std::string local_search_subset_str;
  convert_solution_to_subset(local_search_solution, local_search_subset_str);

  // Save the solution to a file
  std::string sub_dim = std::to_string(data.getSubDimension()) + "_";
  print_solution_to_file("local_search_" + sub_dim + filename,
                          "local_search", local_search_solution, data);
  if (information) {
    pirnt_info(data, "Local Search", local_search_cpu_time,
               local_search_solution, os);
  }

  // Add to results table
  table.local_search_table.add_row({filename, std::to_string(data.getSize()),
                                    std::to_string(data.getDimension()),
                                    std::to_string(data.getSubDimension()),
                                    std::to_string(local_search_distance),
                                    local_search_subset_str,
                                    std::to_string(local_search_cpu_time)});
}

void bound_and_branch_algorithm(const Problem& data,
                                const std::string& filename,
                                ResultTables& table, std::ostream& os,
                                const bool& information) {
  // Run the algorithm
  BranchBound branch_and_bound;
  Solution branch_and_bound_solution = branch_and_bound.Run(data);
  double branch_and_bound_distance =
      Algorithm::CalculateTotalDistance(branch_and_bound_solution);
  double branch_and_bound_cpu_time = branch_and_bound.getExecutionTime();
  std::string branch_and_bound_subset_str;

  convert_solution_to_subset(branch_and_bound_solution,
                             branch_and_bound_subset_str);

  // Save the solution to a file
  std::string sub_dim = std::to_string(data.getSubDimension()) + "_";
  print_solution_to_file("branch_and_bound_" +  sub_dim + filename,
                          "branch_and_bound", branch_and_bound_solution, data);
  if (information) {
    pirnt_info(data, "Branch and Bound", branch_and_bound_cpu_time,
               branch_and_bound_solution, os);
    os << "Nodes generated: " << branch_and_bound.getNodesGenerated() << "\n";
  }
  // Add to results table
  table.branch_and_bound_table.add_row(
      {filename, std::to_string(data.getSize()),
       std::to_string(data.getDimension()),
       std::to_string(data.getSubDimension()),
       std::to_string(branch_and_bound_distance), branch_and_bound_subset_str,
       std::to_string(branch_and_bound_cpu_time),
       std::to_string(branch_and_bound.getNodesGenerated())});
}

void print_solution_to_file(const std::string& filename,
                            const std::string& algorithm,
                            const Solution& solution, const Problem& data) {
  namespace fs = std::filesystem;

  // Create directory structure
  const std::string output_dir = "solutions";
  fs::create_directories(output_dir);

  const std::string alg_dir = output_dir + "/" + algorithm;
  fs::create_directories(alg_dir);

  const std::string file = alg_dir + "/" + filename;

  // Write to file
  std::ofstream out_file(file);
  if (!out_file) {
    throw std::runtime_error("Could not open file for writing: " + file);
  }

  // Write problem data (header)
  out_file << data.getSize() << "\n";
  out_file << data.getDimension() << "\n";

  // Write all points (problem data)
  for (const auto& point : data.getElements()) {
    for (const auto& coord : point.getCoordinates()) {
      out_file << coord << "\t";
    }
    out_file << "\n";
  }

  // Write solution separator and solution points
  out_file << "\nSolution:\n";
  for (const auto& point : solution.getSelectedPoints()) {
    for (const auto& coord : point.getCoordinates()) {
      out_file << coord << "\t";
    }
    out_file << "\n";
  }

  out_file.close();
}

/**
 * @brief Processes a batch of instances from a directory.
 * @param options - The ProgramOptions object containing the command line
 *                  arguments.
 * @param table - The ResultTables object to store the results.
 * @param os - The output stream to write the results to.
 */
void process_batch(const ProgramOptions& options, ResultTables& table,
                   std::ostream& os) {
  os << "Processing batch directory: " << options.batch_directory << "\n";

  for (const auto& entry :
       std::filesystem::directory_iterator(options.batch_directory)) {
    if (entry.path().extension() == ".txt") {
      std::string filename = entry.path().string();
      os << "\nProcessing file: " << filename << "\n";

      try {
        process_instance(filename, options.dimension, table, os,
                         options.verbose);

      } catch (const std::exception& e) {
        std::cerr << "Error processing file " << filename << ": " << e.what()
                  << "\n";
      }
    }
  }
}

/**
 * @brief Processes a single instance of the problem.
 * @param options - The ProgramOptions object containing the command line
 *                  arguments.
 * @param table - The ResultTable object to store the results.
 * @param os - The output stream to write the results to.
 */
void process_single(const ProgramOptions& options, ResultTables& table,
                    std::ostream& os) {
  os << "Processing single file: " << options.input_file << "\n";

  try {
    process_instance(options.input_file, options.dimension, table, os,
                     options.verbose);
  } catch (const std::exception& e) {
    std::cerr << "Error processing file " << options.input_file << ": "
              << e.what() << "\n";
  }
}

/**
 * @brief Muestra la ayuda del programa
 */
void print_help(const std::string& program_name, std::ostream& os) {
  os << "Usage: " << program_name << " [options]\n\n";

  os << "Required options (must provide one of the following):\n";
  os << "  -b, --batch <directory>       Process all files in a directory\n";
  os << "  -s, --single <input_file>      Process a single file\n\n";

  os << "Mandatory parameters:\n";
  os << "  -d, --dimension <dimension>    Set the max dimension of the "
        "problem\n";

  os << "Optional parameters:\n";
  os << "  -o, --output <output_file>     Output file name (default: "
        "salida.log)\n";
  os << "  -v, --verbose                  Show detailed execution "
        "information\n";
  os << "  -h, --help                     Show this help message\n\n";

  os << "Available algorithms:\n";
  os << "  greedy                         Greedy construction algorithm\n";
  os << "  GRASP                          Greedy Randomized Adaptive Search "
        "Procedure\n";
  os << "  LS                             Local Search\n";
  os << "  BnB                            Branch and Bound\n";
}
