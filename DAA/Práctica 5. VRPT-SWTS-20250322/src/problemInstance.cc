/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Diseño y Análisis de Algoritmos
 * Práctica 5: VRPT-SWTS
 *
 * @file problemInstance.cc
 * @brief Implementation of the ProblemInstance class
 * @author Álvaro Pérez Ramos - alu0101574042@ull.edu.es
 * @date 22/03/2025
 */
#include <cmath>
#include <iomanip>
#include <iostream>
#include <stdexcept>
#include <utility>

#include "../includes/problemInstance.h"

void ProblemInstance::calculate_distance_matrix() {
  const size_t num_zones = zones_.size();
  const size_t num_swts = params_.transfer_stations.size();
  const size_t total_locations =
      num_zones + 1 + num_swts + 1;  // zones + depot + SWTSs + landfill

  distance_matrix_.resize(total_locations,
                          std::vector<double>(total_locations, 0.0));

  auto calculate_distance = [](const Position& a, const Position& b) {
    const double dx = a.first - b.first;
    const double dy = a.second - b.second;
    return std::sqrt(dx * dx + dy * dy);
  };

  // Calcular distancias entre zonas
  for (size_t i = 0; i < num_zones; ++i) {
    for (size_t j = i + 1; j < num_zones; ++j) {
      distance_matrix_[i][j] = distance_matrix_[j][i] =
          calculate_distance(zones_[i].getPosition(), zones_[j].getPosition());
    }
  }

  // Índices de referencia
  const size_t depot_idx = num_zones;
  const size_t landfill_idx = num_zones + 1 + num_swts;

  // Zonas a depot y landfill
  for (size_t i = 0; i < num_zones; ++i) {
    distance_matrix_[i][depot_idx] = distance_matrix_[depot_idx][i] =
        calculate_distance(zones_[i].getPosition(), params_.depot);

    distance_matrix_[i][landfill_idx] = distance_matrix_[landfill_idx][i] =
        calculate_distance(zones_[i].getPosition(), params_.landfill);
  }

  // Zonas a SWTS
  for (size_t i = 0; i < num_zones; ++i) {
    for (size_t s = 0; s < num_swts; ++s) {
      size_t swts_idx = num_zones + 1 + s;
      distance_matrix_[i][swts_idx] = distance_matrix_[swts_idx][i] =
          calculate_distance(zones_[i].getPosition(),
                             params_.transfer_stations[s].getPosition());
    }
  }

  // Depot a SWTS y landfill
  for (size_t s = 0; s < num_swts; ++s) {
    size_t swts_idx = num_zones + 1 + s;
    distance_matrix_[depot_idx][swts_idx] =
        distance_matrix_[swts_idx][depot_idx] = calculate_distance(
            params_.depot, params_.transfer_stations[s].getPosition());
  }
  distance_matrix_[depot_idx][landfill_idx] =
      distance_matrix_[landfill_idx][depot_idx] =
          calculate_distance(params_.depot, params_.landfill);

  // SWTS entre sí y a landfill
  for (size_t s1 = 0; s1 < num_swts; ++s1) {
    size_t swts1_idx = num_zones + 1 + s1;

    // A landfill
    distance_matrix_[swts1_idx][landfill_idx] =
        distance_matrix_[landfill_idx][swts1_idx] = calculate_distance(
            params_.transfer_stations[s1].getPosition(), params_.landfill);

    // Entre SWTS
    for (size_t s2 = s1 + 1; s2 < num_swts; ++s2) {
      size_t swts2_idx = num_zones + 1 + s2;
      distance_matrix_[swts1_idx][swts2_idx] =
          distance_matrix_[swts2_idx][swts1_idx] =
              calculate_distance(params_.transfer_stations[s1].getPosition(),
                                 params_.transfer_stations[s2].getPosition());
    }
  }
}

void ProblemInstance::print_distance_matrix(std::ostream& os) const {
  const size_t numZones = zones_.size();
  const size_t num_swts = params_.transfer_stations.size();
  const size_t totalLocations =
      numZones + 1 + num_swts + 1;  // zones + depot + SWTSs + landfill

  os << "\nMatriz de distancias entre zonas y ubicaciones clave:\n";

  // Cabecera
  os << "Desde A \\ Hasta B |";
  for (size_t i = 1; i <= numZones; ++i) {
    if (i < 10) {
      os << std::setw(11) << "Zona 0" + std::to_string(i) << " |";
    } else {
      os << std::setw(11) << "Zona " + std::to_string(i) << " |";
    }
  }
  os << std::setw(11) << "Depot" << " |";
  for (size_t i = 0; i < num_swts; ++i) {
    if (i < 10) {
      os << std::setw(11) << "IF 0" + std::to_string(i) << " |";
    } else {
      os << std::setw(11) << "IF " + std::to_string(i) << " |";
    }
  }
  os << std::setw(11) << "Landfill" << " |";
  os << std::endl;

  // Filas de datos
  for (size_t i = 0; i < totalLocations; ++i) {
    // Línea divisoria antes de cada fila
    os << "+" << std::string(17, '-') << "+";
    for (size_t j = 0; j < totalLocations; ++j) {
      os << std::string(12, '-') << "+";
    }
    os << std::endl;

    // Etiqueta de la fila
    if (i < numZones) {
      if (i < 9) {
        os << "Zona 0" << i + 1 << std::setw(12) << "|";
      } else {
        os << "Zona " << i + 1 << std::setw(12) << "|";
      }
    } else if (i == numZones) {
      os << "Depot" << std::setw(14) << "|";
    } else if (i < numZones + 1 + num_swts) {
      if ((i - numZones - 1) < 10) {
        os << "IF 0" << (i - numZones - 1) << std::setw(14) << "|";
      } else {
        os << "IF" << std::setw(2) << (i - numZones - 1) << std::setw(15)
           << "|";
      }
    } else {
      os << "Landfill" << std::setw(11) << "|";
    }

    // Contenido de la fila
    for (size_t j = 0; j < totalLocations; ++j) {
      if (i == j) {
        os << std::setw(11) << "0.0" << " |";
      } else {
        os << std::setw(11) << std::fixed << std::setprecision(2)
           << distance_matrix_[i][j] << " |";
      }
    }
    os << std::endl;
  }

  // Línea divisoria inferior
  os << "+" << std::string(17, '-') << "+";
  for (size_t i = 0; i < totalLocations; ++i) {
    os << std::string(12, '-') << "+";
  }
  os << std::endl;
}
