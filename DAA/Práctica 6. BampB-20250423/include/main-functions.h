/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Diseño y Análisis de Algoritmos
 * Práctica 6: Branch and Bound
 *
 * @file main-functions.h
 * @brief This file contains the definition of the main functions for the
 *        program.
 *
 * @author 
 * @date 24 APR 2025
 */

#ifndef __MAIN_FUNCTIONS_H__
#define __MAIN_FUNCTIONS_H__

#include <filesystem>
#include <fstream>
#include <memory>

// #include "../include/distance-matrix.h"
#include "../include/branch-bound.h"
#include "../include/grasp.h"
#include "../include/greedy.h"
#include "../include/local-search.h"
#include "../include/program-arguments.h"
#include "../include/result-table.h"

typedef std::pair<std::ostream*, std::unique_ptr<std::ofstream>> coutOrFile;

const std::vector<int> LRC_SIZES = {2, 3};         // LRC sizes for GRASP
const std::vector<int> MAX_ITERATIONS = {10, 20};  // Max iterations for GRASP
struct ResultTables {
  ResultTable greedy_table;
  ResultTable grasp_table;
  ResultTable local_search_table;
  ResultTable branch_and_bound_table;
};

/**
 * @brief Processes the command line arguments and returns the output stream
 *        (cout or file).
 * @param argc Number of command line arguments.
 * @param argv Array of command line arguments.
 * @return A pair containing a pointer to the output stream and a unique_ptr to
 *         the output file stream (if applicable).
 */
coutOrFile process_output_stream(int argc, char* argv[]);

/**
 * @brief Converts a solution to a subset string.
 * @param solution - The solution to convert.
 * @param subset_str - The string representation of the subset.
 */
void convert_solution_to_subset(const Solution& solution,
                                std::string& subset_str);

void greedy_algorithm(const Problem& data, const std::string& filename,
                      ResultTables& table, std::ostream& os,
                      const bool& information);

void grasp_algorithm(const Problem& data, const std::string& filename,
                     ResultTables& table, std::ostream& os,
                     const bool& information);

void local_search_algoritm(const Problem& data, const std::string& filename,
                           ResultTables& table, std::ostream& os,
                           const bool& information);

void bound_and_branch_algorithm(const Problem& data,
                                const std::string& filename,
                                ResultTables& table, std::ostream& os,
                                const bool& information);

void pirnt_info(const Problem& data, const std::string& algorithm,
                const double& cpu_time, const Solution& solution,
                std::ostream& os = std::cout);

void print_solution_to_file(const std::string& filename,
                            const std::string& algorithm,
                            const Solution& solution, const Problem& data);

/**
 * @brief Processes a single instance of the problem.
 * @param filename - The name of the file containing the problem data.
 * @param sub_dim - The sub-dimension of the problem.
 * @param table - The ResultTable object to store the results.
 * @param os - The output stream to write the results to.
 * @param information - A boolean flag to indicate whether to print
 * additional
 */
void process_instance(const std::string& filename, const int& sub_dim,
                      ResultTables& table, std::ostream& os, bool information);

/**
 * @brief Processes a batch of instances from a directory.
 * @param options - The ProgramOptions object containing the command line
 *                  arguments.
 * @param table - The ResultTable object to store the results.
 * @param os - The output stream to write the results to.
 */
void process_batch(const ProgramOptions& options, ResultTables& table,
                   std::ostream& os = std::cout);

/**
 * @brief Processes a single instance of the problem.
 * @param options - The ProgramOptions object containing the command line
 *                  arguments.
 * @param table - The ResultTable object to store the results.
 * @param os - The output stream to write the results to.
 */
void process_single(const ProgramOptions& options, ResultTables& table,
                    std::ostream& os = std::cout);

/**
 * @brief Muestra la ayuda del programa
 */
void print_help(const std::string& program_name = "program",
                std::ostream& os = std::cout);

#endif  // __MAIN_FUNCTIONS_H__
