/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Diseño y Análisis de Algoritmos
 * Práctica 5: VRPT-SWTS
 *
 * @file distanceService.cc
 * @brief Implementation of the DistanceService class
 * @author Álvaro Pérez Ramos - alu0101574042@ull.edu.es
 * @date 22/03/2025
 */
#include <cmath>
#include <limits>

#include "../includes/distanceService.h"

double EuclideanDistanceService::calculate_distance(const Position& a,
                                                    const Position& b) const {
  const double dx = a.first - b.first;
  const double dy = a.second - b.second;
  return std::sqrt(dx * dx + dy * dy);
}

double EuclideanDistanceService::get_distance(
    int from, int to, const std::vector<std::vector<double>>& distances,
    size_t num_zones) const {

  size_t from_idx = (from >= 0)    ? static_cast<size_t>(from)
                    : (from == -1) ? num_zones                    // depot
                    : (from <= -2) ? num_zones + 1 + (-from - 2)  // SWTS
                                   : num_zones;  // default to depot if invalid

  size_t to_idx = (to >= 0)    ? static_cast<size_t>(to)
                  : (to == -1) ? num_zones
                  : (to <= -2) ? num_zones + 1 + (-to - 2)
                               : num_zones;

  return distances[from_idx][to_idx];
}

int EuclideanDistanceService::get_closest_swts(
    int from, const std::vector<std::vector<double>>& distances,
    size_t num_zones) const {
  const size_t num_swts = distances.size() - num_zones - 2;
  if (num_swts == 0) return -1;  // no SWTS available

  double min_dist = std::numeric_limits<double>::max();
  int closest_swts = -1;

  for (size_t i = 0; i < num_swts; ++i) {
    double dist =
        get_distance(from, -2 - static_cast<int>(i), distances, num_zones);
    if (dist < min_dist) {
      min_dist = dist;
      closest_swts = -2 - static_cast<int>(i);
    }
  }

  return closest_swts;
}
