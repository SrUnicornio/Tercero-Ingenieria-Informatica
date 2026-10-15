/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Diseño y Análisis de Algoritmos
 * Práctica 5: VRPT-SWTS
 *
 * @file distanceService.h
 * @brief Definition of the DistanceService class
 * @author  Álvaro Pérez Ramos - alu0101574042@ull.edu.es
 * @date 22/03/2025
 */
#ifndef __DISTANCE_SERVICE_H__
#define __DISTANCE_SERVICE_H__

#include <vector>

#include "position.h"

/**
 * @brief Abstract class for distance calculation services
 */
class DistanceService {
 public:
  virtual ~DistanceService() = default;
  virtual double calculate_distance(const Position& a,
                                    const Position& b) const = 0;
  virtual double get_distance(int from, int to,
                              const std::vector<std::vector<double>>& distances,
                              size_t num_zones) const = 0;
  virtual int get_closest_swts(
      int from, const std::vector<std::vector<double>>& distances,
      size_t num_zones) const = 0;
};

/**
 * @brief Euclidean distance calculation service
 */
class EuclideanDistanceService : public DistanceService {
 public:
  /**
   * @brief Calculate the Euclidean distance between two positions
   * @param a - First position
   * @param b - Second position
   * @return double - Euclidean distance between the two positions
   */
  double calculate_distance(const Position& a,
                            const Position& b) const override;

  /**
   * @brief Get the distance between two points in a distance matrix
   * @param from - Index of the first point
   * @param to - Index of the second point
   * @param distances - Distance matrix
   * @param num_zones - Number of zones
   * @return double - Distance between the two points
   */
  double get_distance(int from, int to,
                      const std::vector<std::vector<double>>& distances,
                      size_t num_zones) const override;

  /**
   * @brief Get the closest SWTS to a given point in a distance matrix
   * @param from - Index of the point
   * @param distances - Distance matrix
   * @param num_zones - Number of zones
   * @return int - Index of the closest SWTS
   */
  int get_closest_swts(int from,
                       const std::vector<std::vector<double>>& distances,
                       size_t num_zones) const override;
};

#endif  // __DISTANCE_SERVICE_H__
