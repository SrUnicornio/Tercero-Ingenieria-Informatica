/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Diseño y Análisis de Algoritmos
 * Práctica 5: VRPT-SWTS
 *
 * @file problemReader.cc
 * @brief Implementation of the ProblemReader class
 * @author Álvaro Pérez Ramos - alu0101574042@ull.edu.es
 * @date 22/03/2025
 */
#include <filesystem>
#include <fstream>
#include <functional>
#include <sstream>
#include <stdexcept>
#include <unordered_map>
#include <utility>

#include "../includes/problemReader.h"
#include "../includes/vehicle.h"

ProblemInstance ProblemReader::read_from_file(const std::string& filename) {
  std::ifstream file(filename);
  if (!file.is_open()) {
    throw std::runtime_error("Could not open file: " + filename);
  }

  auto params = read_parameters(file);
  auto tolerances =
      read_tolerances(file);  // Currently unused but read for completeness
  auto zones = read_zones(file);

  return ProblemInstance(std::move(params), std::move(zones));
}

std::vector<ProblemInstance> ProblemReader::read_from_directory(
    const std::string& dir_path, std::vector<std::string>& filenames) {
  std::vector<ProblemInstance> instances;

  for (const auto& entry : std::filesystem::directory_iterator(dir_path)) {
    if (entry.is_regular_file()) {
      try {
        filenames.push_back(entry.path().string());
        instances.push_back(read_from_file(entry.path().string()));
      } catch (const std::exception& e) {
        std::cerr << "Warning: Could not process file " << entry.path() << ": "
                  << e.what() << "\n";
      }
    }
  }

  return instances;
}

ProblemParameters ProblemReader::read_parameters(std::ifstream& file) {
  ProblemParameters parameters;
  int maxDurationCollection{0}, maxDurationTransport{0};
  int collectionCapacity{0}, transportCapacity{0};
  int speed{0};
  std::string line;
  // Mapeo de parámetros a funciones lambda para asignar valores
  std::unordered_map<std::string, std::function<void(std::istringstream&)>>
      parameterMap = {
          {"L1",
           [&](std::istringstream& iss) { iss >> maxDurationCollection; }},
          {"L2", [&](std::istringstream& iss) { iss >> maxDurationTransport; }},
          {"num_vehicles",
           [&](std::istringstream& iss) { iss >> parameters.max_vehicles; }},
          {"num_zones",
           [&](std::istringstream& iss) { iss >> parameters.max_zones; }},
          {"Lx",
           [&](std::istringstream& iss) { iss >> parameters.area_width; }},
          {"Ly",
           [&](std::istringstream& iss) { iss >> parameters.area_height; }},
          {"Q1", [&](std::istringstream& iss) { iss >> collectionCapacity; }},
          {"Q2", [&](std::istringstream& iss) { iss >> transportCapacity; }},
          {"V", [&](std::istringstream& iss) { iss >> speed; }},
          {"Depot",
           [&](std::istringstream& iss) {
             iss >> parameters.depot.first >> parameters.depot.second;
           }},
          {"Dumpsite", [&](std::istringstream& iss) {
             iss >> parameters.landfill.first >> parameters.landfill.second;
           }}};

  while (std::getline(file, line)) {
    if (line.empty() || !std::isalpha(line[0]))
      continue;  // Evita líneas vacías y datos inválidos

    std::istringstream iss(line);
    std::string parameter;
    iss >> parameter;

    // Manejo especial para IF
    if (parameter.find("IF") == 0) {
      Position pos;
      iss >> pos.first >> pos.second;

      // Asignar ID automático (-2, -3, -4, etc.)
      int id = parameters.transfer_stations.size();
      parameters.transfer_stations.emplace_back(id, pos);
      continue;
    }

    auto it = parameterMap.find(parameter);
    if (it != parameterMap.end()) {
      it->second(iss);  // Ejecuta la función correspondiente
    }
  }

  // Crear objetos de vehículos después de leer los parámetros
  parameters.collection_vehicle =
      CollectionVehicle(maxDurationCollection, collectionCapacity, speed);
  parameters.transport_vehicle =
      TransportVehicle(maxDurationTransport, transportCapacity, speed);
  // Asignar los vehículos a los parámetros

  return parameters;
}

Tolerances ProblemReader::read_tolerances(std::ifstream& file) {
  Tolerances tolerances;
  std::string line;

  file.clear();
  file.seekg(0);

  while (std::getline(file, line)) {
    if (line.empty() || !std::isalpha(line[0])) continue;

    std::istringstream iss(line);
    std::string param;
    iss >> param;

    if (param == "epsilon")
      iss >> tolerances.epsilon;
    else if (param == "offset")
      iss >> tolerances.offset;
  }

  return tolerances;
}

std::vector<CollectionZone> ProblemReader::read_zones(std::ifstream& file) {
  std::vector<CollectionZone> zones;
  std::string line;

  file.clear();
  file.seekg(0);

  while (std::getline(file, line)) {
    if (line.empty() || std::isalpha(line[0])) continue;

    std::istringstream iss(line);
    int id;
    Position pos;
    double collection_time, demand;

    if (!(iss >> id >> pos.first >> pos.second >> collection_time >> demand)) {
      throw std::runtime_error("Invalid zone data format");
    }

    zones.emplace_back(id, pos, collection_time, demand);
  }

  return zones;
}
