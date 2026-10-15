/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Diseño y Análisis de Algoritmos
 * Práctica 6: Branch and Bound
 * 
 * @file program-arguments.h
 * @brief This file contains the definition of the ProgramOptions struct and
 *        the ArgumentParser clas.
 * @author 
 * @date 24 APR 2025
 */

#ifndef __PROGRAM_ARGUMENTS_H__
#define __PROGRAM_ARGUMENTS_H__

#include <cctype>
#include <string>
#include <stdexcept>

/**
 * @brief Struct to hold the program options.
 */
struct ProgramOptions {
  bool batch_mode = false;
  std::string batch_directory;
  bool single_file_mode = false;
  std::string input_file;
  bool help = false;
  bool verbose = false;
  std::string output_file = "salida.log";
  int dimension = -1;
};

/**
 * @brief Class to parse command-line arguments for the program.
 */
class ArgumentParser {
 public:
  /**
   * @brief Constructor for ArgumentParser.
   * @param argc Number of command-line arguments.
   * @param argv Array of command-line arguments.
   */
  ArgumentParser(int argc, char* argv[]) : argc(argc), argv(argv) {}

  /**
   * @brief Parses the command-line arguments and populates the ProgramOptions
   *        struct.
   * @return ProgramOptions struct with the parsed options.
   * @throws std::invalid_argument if any required argument is missing or
   *         invalid.
   */
  ProgramOptions parse();

 private:
  int argc;
  char** argv;
  ProgramOptions options;

  bool batch_set = false, single_set = false, dimension_set = false,
       algorithm_set = false, output_set = false, verbose_set = false,
       help_set = false;

  /**
   * @brief Handles the batch mode argument. (directory)
   * @param i - The index of the current argument in argv.
   * @throws std::invalid_argument if the batch directory is not provided.
   */
  void handle_batch(int& i);

  /**
   * @brief Handles the single file mode argument. (file)
   * @param i - The index of the current argument in argv.
   * @throws std::invalid_argument if the input file is not provided.
   */
  void handle_single(int& i);

  /**
   * @brief Handles the dimension argument. (dimension)
   * @param i - The index of the current argument in argv.
   * @throws std::invalid_argument if the dimension is not provided or is
   *         invalid.
   */
  void handle_dimension(int& i);

  /**
   * @brief Handles the algorithm argument. (algorithm)
   * @param i - The index of the current argument in argv.
   * @throws std::invalid_argument if the algorithm is not provided or is
   *         invalid.
   */
  void handle_algorithm(int& i);

  /**
   * @brief Handles the output file argument. (output)
   * @param i - The index of the current argument in argv.
   * @throws std::invalid_argument if the output file is not provided.
   */
  void handle_output(int& i);

  /**
   * @brief Handles the verbose argument. (verbose)
   * @param i - The index of the current argument in argv.
   */
  void handle_verbose();

  /**
   * @brief Handles the help argument. (help)
   * @param i - The index of the current argument in argv.
   */
  void handle_help();

  /**
   * @brief Handles the unknown argument.
   * @param i - The index of the current argument in argv.
   * @throws std::invalid_argument if an unknown argument is encountered.
   */
  std::string read_next_arg(int& i, const std::string& missing_message);

  /**
   * @brief Validates the parsed options.
   * @throws std::invalid_argument if any required option is missing or
   *         invalid.
   */
  void validate_options();

  /**
   * @brief Normalizes the algorithm name to lowercase or use alias.
   * @param name - The algorithm name to normalize.
   * @return The normalized algorithm name.
   */
  std::string normalize_algorithm_name(const std::string& name);
};

#endif // __PROGRAM_ARGUMENTS_H__