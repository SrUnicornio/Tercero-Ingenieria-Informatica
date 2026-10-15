/**
 * Universiddad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Diseño y Análisis de Algoritmos
 * Práctica 5: VRPT-SWTS
 *
 * @file grasp.h
 * @brief Definition of the GraspConstructor class
 * @author Álvaro Pérez Ramos - alu0101574042@ull.edu.es
 * @date 22/03/2025
 */
#ifndef __GRASP_CONSTRUCTOR_H__
#define __GRASP_CONSTRUCTOR_H__

#include <memory>
#include <random>
#include <vector>

#include "routeBuilder.h"
#include "transportRouteBuilder.h"
#include "distanceService.h"
#include "problemInstance.h"

/**
 * @brief Class for constructing routes using the GRASP algorithm
 */
class GraspConstructor : public RouteBuilder {
 public:

  using Route = RouteBuilder::Route;
  /**
   * @brief Constructor for GraspConstructor
   * @param calculator - Distance calculator
   * @param lrc_size - Size of the LRC
   * @param randomness - Randomness level (0 = deterministic, 1 = random)
   */
  GraspConstructor(std::unique_ptr<DistanceService> calculator, int lrc_size,
                   int randomness = 1)
      : RouteBuilder(std::move(calculator)),
        lrc_size_(lrc_size),
        randomness_(randomness) {}
  
  /**
   * @brief Destructor for GraspConstructor
   */
  ~GraspConstructor() override = default;
  
  /**
   * @brief Build routes using the GRASP algorithm
   * @param instance - Problem instance
   */
  void build_routes(const ProblemInstance& instance) override;
  
  /**
   * @brief Print the report of the routes
   * @param instance - Problem instance
   * @param os - Output stream
   */
  void print_report(const ProblemInstance& instance,
                    std::ostream& os = std::cout) const override;

 private:
  int lrc_size_;
  int randomness_;  // 0 = deterministic (Greedy), 1 = random (GRASP)
  
  /**
   * @brief Structure to hold candidate zones for the LRC
   */
  struct CandidateZone {
    int zone_id;
    double distance;
    double demand;
  };

  /**
   * @brief Get the candidate zones for the LRC
   * @param instance - Problem instance
   * @param current_route - Current route
   * @return std::vector<CandidateZone> - Candidate zones
   */
  std::vector<CandidateZone> get_lrc(
      const std::vector<CandidateZone>& candidates) const;
  std::mt19937 rng{std::random_device{}()};
};

#endif  // __GRASP_CONSTRUCTOR_H__
