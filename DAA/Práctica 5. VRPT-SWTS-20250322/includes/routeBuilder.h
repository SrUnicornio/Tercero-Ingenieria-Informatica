/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Diseño y Análisis de Algoritmos
 * Práctica 5: VRPT-SWTS
 *
 * @file routeBuilder.h
 * @brief Definition of the RouteBuilder class
 * @author Álvaro Pérez Ramos - alu0101574042@ull.edu.es
 * @date 22/03/2025
 */
#ifndef ROUTE_BUILDER_H
#define ROUTE_BUILDER_H

#include <iomanip>
#include <iostream>
#include <string>

#include "distanceService.h"
#include "problemInstance.h"

class RouteBuilder {
 public:
  /**
   * @brief structure to hold the route information
   */
  struct Route {
    std::vector<int> path{-1};  // Start at depot
    double total_distance{0};
    double total_demand{0};
    double total_time{0};
    int subroutes{0};
  };

  /**
   * @brief Default constructor for RouteBuilder
   */
  RouteBuilder() = default;
  /**
   * @brief virtual destructor for RouteBuilder
   */
  virtual ~RouteBuilder() = default;

  /**
   * @brief Build routes for the given problem instance
   * @param instance - Problem instance
   */
  virtual void build_routes(const ProblemInstance& instance) = 0;

  /**
   * @brief Print the report of the routes
   * @param instance - Problem instance
   * @param os - Output stream
   */
  virtual void print_report(const ProblemInstance& instance,
                            std::ostream& os = std::cout) const = 0;
  
  /**
   * @brief Print the statistics of the routes
   * @param routes - Routes to print
   * @param os - Output stream
   */
  void print_statistics(const std::vector<Route>& routes,
                        std::ostream& os = std::cout) const;
  
  /**
   * @brief Get the time string for the given time in minutes
   * @param minutes - Time in minutes
   * @return std::string - Formatted time string
   */
  const std::string get_time_string(double minutes) const {
    return format_time(minutes);
  }

  /**
   * @brief Get the routes
   * @return const std::vector<Route>& - Routes
   */
  const std::vector<Route>& get_routes() const { return routes_; }
 protected:
  std::unique_ptr<DistanceService> distance_calculator_;
  std::vector<Route> routes_;

  /**
   * @brief Constructor for RouteBuilder
   * @param calculator - Distance calculator
   */
  RouteBuilder(std::unique_ptr<DistanceService> calculator)
      : distance_calculator_(std::move(calculator)) {}

  /**
   * @brief Format the time in minutes to a string
   * @param minutes - Time in minutes
   * @return std::string - Formatted time string
   */
  std::string format_time(double minutes) const;
};

#endif  // ROUTE_BUILDER_H
