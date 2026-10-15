/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Diseño y Análisis de Algoritmos
 * Práctica 5: VRPT-SWTS
 *
 * @file mainFunctions.h
 * @brief Definition of the main functions for the program
 * @author Álvaro Pérez Ramos - alu0101574042@ull.edu.es
 * @date 22/03/2025
 */
#ifndef __MAINFUNCTIONS_H__
#define __MAINFUNCTIONS_H__

#include <chrono>
#include <cmath>
#include <iomanip>
#include <iostream>
#include <limits>
#include <stdexcept>
#include <vector>

#include "dataVisualizer.h"
#include "grasp.h"
#include "localSearch.h"
#include "problemReader.h"
#include "resultTable.h"
#include "summaryReporter.h"
#include "transportRouteBuilder.h"
#include "vehicle.h"
#include "gvns.h"

constexpr int DEFAULT_GRASP_ITERATIONS = 1000;
const std::vector<int> DEFAULT_LRC_SIZE = {2, 3, 4, 5};
const std::vector<int> DEFAULT_KMAX_SIZE = {2, 3, 4, 5};

using coutOrFile = std::pair<std::ostream*, std::unique_ptr<std::ofstream>>;

namespace {
struct Metrics {
  double total_distance;
  double total_time;
  double transport_time;
  int subroutes;
  double total_demand;
};

Metrics calculate_metrics(
    const std::vector<RouteBuilder::Route>& routes,
    const std::vector<TransportRouteBuilder::TransportRoute>& transport) {
  Metrics m{0, 0, 0, 0, 0};

  for (const auto& r : routes) {
    m.total_distance += r.total_distance;
    m.total_time += r.total_time;
    m.subroutes += r.subroutes;
    m.total_demand += r.total_demand;
  }

  for (const auto& t : transport) {
    m.total_distance += t.total_distance;
    m.transport_time += t.total_time;
  }

  m.total_time += m.transport_time;
  return m;
}

void print_greedy_info(GraspConstructor& grasp,
                        TransportRouteBuilder& transport,
                        const ProblemInstance& instance, std::ostream& os) {
  os << "\nGreedy Construction:\n";
  os << "----------------------------\n";
  grasp.print_report(instance, os);
  os << "----------------------------\n";
  transport.print_report(instance, os);
  os << "----------------------------\n";
}

void print_iteration_info(int iteration, GraspConstructor& grasp,
                          TransportRouteBuilder& transport,
                          const ProblemInstance& instance, std::ostream& os) {
  os << "\nIteration " << (iteration + 1) << ":\n";
  os << "----------------------------\n";
  grasp.print_report(instance, os);
  os << "----------------------------\n";
  transport.print_report(instance, os);
  os << "----------------------------\n";
}
}

/**
 * @brief structure to hold the result of the GRASP algorithm
 */
struct GraspResult {
  double best_distance;
  std::string best_time_str;
  double best_time;
  std::vector<RouteBuilder::Route> best_routes;
  std::vector<TransportRouteBuilder::TransportRoute> transport_routes;
  std::string transport_time_str;
};

/**
 * @brief structure to hold the program options
 */
struct program_options {
  std::string input_file;
  std::string output_file;
  bool batch_mode = false;
  bool single_file_mode = false;
  std::string batch_directory;
  bool help = false;
  bool information = false;
};

/**
 * @brief Print the help message
 * @param os - Output stream
 */
void print_help(std::ostream& os = std::cout);

/**
 * @brief Process the output stream based on command line arguments
 * @param argc - Number of command line arguments
 * @param argv - Command line arguments
 * @return coutOrFile - Output stream and file stream
 */
coutOrFile process_output_stream(int argc, char* argv[]);

/**
 * @brief Print the demand report for the collection zones
 * @param instance - Problem instance
 * @param os - Output stream
 */
void print_demand_report(const ProblemInstance& instance,
                         std::ostream& os = std::cout);

/**
 * @brief Process a batch of files in a directory
 * @param directory - Directory containing the files
 * @param reporter - Summary reporter
 * @param os - Output stream
 * @param information - Flag to show detailed information
 */
void process_batch(const std::string& directory, SummaryReporter& reporter,
                   std::ostream& os = std::cout, bool information = false);

/**
 * @brief Process a single file
 * @param filename - Name of the file
 * @param reporter - Summary reporter
 * @param os - Output stream
 * @param information - Flag to show detailed information
 */
void process_single_file(const std::string& filename, SummaryReporter& reporter,
                         std::ostream& os = std::cout, bool information = false);

/**
 * @brief Extract the instance number from the filename
 * @param filename - Name of the file
 * @return int - Instance number
 */
int extract_instance_number(const std::string& filename);

/**
 * @brief Execute the GRASP algorithm
 * @param instance - Problem instance
 * @param os - Output stream
 * @param information - Flag to show detailed information
 * @param use_greedy - Flag to use greedy algorithm
 * @return GraspResult - Result of the GRASP algorithm
 */
GraspResult execute_grasp(const ProblemInstance& instance,
                          std::ostream& os = std::cout,
                          bool information = false, bool use_greedy = false,
                          int lrc = 2);

/**
 * @brief Process command line arguments
 * @param argc - Number of command line arguments
 * @param argv - Command line arguments
 * @return program_options - Program options
 */
program_options process_arguments(int argc, char* argv[]);

/**
 * @brief Print the reports of the GRASP and transport routes
 * @param grasp - Grasp constructor
 * @param transport - Transport route builder
 * @param instance - Problem instance
 * @param os - Output stream
 * @param information - Flag to show detailed information
 * @param use_greedy - Flag to use greedy algorithm
 * @param iteration - Current iteration number
 * @param best_result - Best result of the GRASP algorithm
 */
void print_reports(const GraspConstructor& grasp_builder,
                   const TransportRouteBuilder& transport,
                   const ProblemInstance& instance,
                   std::ostream& os = std::cout, bool information = false,
                   bool use_greedy = false, int i = 0);

/**
 * @brief Print the best GRASP report
 * @param best_grasp - Best grasp result
 * @param os - Output stream
 */
void print_best_grasp_report(const GraspResult& best_grasp, std::ostream& os);

/**
 * @brief Print the best local search report
 * @param local_search_result - Local search result
 * @param os - Output stream
 */
void print_best_local_search_report(const std::vector<RouteBuilder::Route>& local_search_result,
                                     std::ostream& os = std::cout);

/**
 * @brief Process a problem instance
 * @param instance - Problem instance
 * @param filename - Name of the file
 * @param reporter - Summary reporter
 * @param os - Output stream
 * @param information - Flag to show detailed information
 * @param greedy_table - Result table for greedy algorithm
 */
void process_instance(const ProblemInstance& instance,
                      const std::string& filename, SummaryReporter& reporter,
                      std::ostream& os, bool information,
                      ResultTable& greedy_table, ResultTable& grasp_table, ResultTable& gvns_table);

/**
 * @brief Print the GVNS report
 * @param gvns_result - GVNS result
 * @param os - Output stream
 */
void print_gvns_report(const std::vector<RouteBuilder::Route>& gvns_result,
                       std::ostream& os = std::cout);
#endif  // __MAINFUNCTIONS_H__