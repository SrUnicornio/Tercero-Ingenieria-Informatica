/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Diseño y Análisis de Algoritmos
 * Práctica 5: VRPT-SWTS
 *
 * @file dataVisualizer.cc
 * @brief Implementation of the DataVisualizer class
 * @author Álvaro Pérez Ramos - alu0101574042@ull.edu.es
 * @date 22/03/2025
 */
#include <filesystem>
#include <fstream>

#include "../includes/dataVisualizer.h"
#include "../includes/vehicle.h"

void DataVisualizer::generate_map_data(const ProblemInstance& instance,
                                       const std::string& filename_prefix) {
  namespace fs = std::filesystem;

  // Create output directory if it doesn't exist
  const std::string output_dir = "data";
  if (!fs::exists(output_dir)) {
    fs::create_directory(output_dir);
  }

  // Generate a unique filename if multiple instances are visualized
  const std::string filename = output_dir + "/" + filename_prefix + ".txt";

  std::ofstream out_file(filename);
  if (!out_file) {
    throw std::runtime_error("Could not open file for writing: " + filename);
  }

  const auto& params = instance.parameters();

  // Deposit
  out_file << params.depot.first << " " << params.depot.second
           << " Depot D\n";
  // Write key locations
  for (const auto& swts : params.transfer_stations) {
    out_file << swts.getPosition().first << " " << swts.getPosition().second
             << " IF" << " T" + std::to_string(swts.getId() + 1) << "\n";
  }
  out_file << params.landfill.first << " " << params.landfill.second
           << " Dumpsite L\n";

  // Write CollectionZones
  for (const auto& zone : instance.CollectionZones()) {
    out_file << zone.getPosition().first << " " << zone.getPosition().second
             << " Zone " << zone.getId() << "\n";
  }
}

void DataVisualizer::generate_map_data_solution(
    const ProblemInstance& instance, const std::string& filename_prefix,
    const std::vector<RouteBuilder::Route>& routes,
    const std::vector<TransportRouteBuilder::TransportRoute>&
        transport_routes) {
  namespace fs = std::filesystem;

  // Create output directory if it doesn't exist
  const std::string output_dir = "solve_data";
  if (!fs::exists(output_dir)) {
    fs::create_directory(output_dir);
  }

  // Generate a unique filename if multiple instances are visualized
  const std::string filename = output_dir + "/" + filename_prefix + ".txt";

  std::ofstream out_file(filename);
  if (!out_file) {
    throw std::runtime_error("Could not open file for writing: " + filename);
  }

  const auto& params = instance.parameters();

  // Deposit
  out_file << params.depot.first << " " << params.depot.second
           << " Depot D\n";
  // Write key locations
  for (const auto& swts : params.transfer_stations) {
    out_file << swts.getPosition().first << " " << swts.getPosition().second
             << " IF" << " T" + std::to_string(swts.getId() + 1) << "\n";
  }
  out_file << params.landfill.first << " " << params.landfill.second
           << " Dumpsite L\n";

  // Write CollectionZones
  for (const auto& zone : instance.CollectionZones()) {
    out_file << zone.getPosition().first << " " << zone.getPosition().second
             << " Zone " << zone.getId() << "\n";
  }

  // Write routes
  for (const auto& route : routes) {
    out_file << "Route: ";
    for (int stop : route.path) {
      if (stop == -1)
        out_file << "D ";
      else if (stop <= -2)  // Para todas las estaciones de transferencia
        out_file << "T" << (-stop - 1) << " ";  // T0, T1, T2, etc.
      else
        out_file << stop + 1 << " ";  // +1 to match input file numbering
    }
    out_file << "\n";
  }

  // Write transport routes
  for (const auto& transport_route : transport_routes) {
    out_file << "Transport Route: ";
    for (int stop : transport_route.path) {
      if (stop == -1)
        out_file << "L ";
      else if (stop <= -2)  // Para todas las estaciones de transferencia
        out_file << "T" << (-stop - 1) << " ";  // T0, T1, T2, etc.
    }
    out_file << "\n";
  }
}