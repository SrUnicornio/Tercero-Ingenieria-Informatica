/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Diseño y Análisis de Algoritmos
 * Práctica 5: VRPT-SWTS
 *
 * @file transportRouteBuilder.h
 * @brief Definition of the TransportRouteBuilder class
 * @author Álvaro Pérez Ramos - alu0101574042@ull.edu.es
 * @date 22/03/2025
 */
#ifndef __TRANSPORT_ROUTE_BUILDER_H__
#define __TRANSPORT_ROUTE_BUILDER_H__

#include <algorithm>

#include "routeBuilder.h"
#include "grasp.h"


class TransportRouteBuilder : public RouteBuilder {
 public:
  /**
   * @brief structure to hold the transport route information
   */
  struct TransportRoute {
    std::vector<int> path;
    double total_distance = 0;
    double total_waste = 0;
    double total_time = 0;
    double total_transported = 0;
  };

  /**
   * @brief structure to hold the transport task information
   */
  struct TransportTask {
    double waste_amount;
    int swts_id;
    double arrival_time;
  };

  /**
   * @brief Default constructor for TransportRouteBuilder
   */
  TransportRouteBuilder() = default;
  /**
   * @brief Constructor for TransportRouteBuilder
   * @param calculator - Distance calculator
   */
  TransportRouteBuilder(std::unique_ptr<DistanceService> calculator, 
                        std::vector<RouteBuilder::Route> collection_routes)
      : RouteBuilder(std::move(calculator)), 
        collection_routes_(std::move(collection_routes)) {}
  
  /**
   * @brief Destructor for TransportRouteBuilder
   */
  ~TransportRouteBuilder() override = default;

  /**
   * @brief Build transport routes for the given problem instance
   * @param instance - Problem instance
   */
  void build_routes(const ProblemInstance& instance) override;
  
  /**
   * @brief Print the report of the transport routes
   * @param instance - Problem instance
   * @param os - Output stream
   */
  void print_report(const ProblemInstance& instance,
                    std::ostream& os = std::cout) const override;
  
  /**
   * @brief Print the statistics of the transport routes
   * @param routes - Transport routes to print
   * @param os - Output stream
   */
  void print_statistics(const std::vector<TransportRoute>& routes,
                        std::ostream& os = std::cout) const;  
  
  /**
   * @brief Get the routes
   * @return const std::vector<TransportRoute>& - Transport routes
   */
  const std::vector<TransportRoute>& get_routes() const { return routes_; }

 private:
  std::vector<TransportRoute> routes_;
  std::vector<TransportTask> tasks_;
  std::vector<RouteBuilder::Route> collection_routes_;

  /**
   * @brief Extract the transport tasks from the collection routes
   * @param collection_routes - Collection routes
   * @param instance - Problem instance
   * @return std::vector<TransportTask> - Transport tasks
   */
  std::vector<TransportTask> extract_tasks(
      const std::vector<RouteBuilder::Route>& collection_routes,
      const ProblemInstance& instance);
  
  /**
   * @brief Select the best vehicle for a given transport task
   * @param vehicles - Available vehicles
   * @param task - Transport task
   * @param instance - Problem instance
   * @return int - Index of the best vehicle
   */
  int select_best_vehicle(const std::vector<TransportRoute>& vehicles,
                          const TransportTask& task,
                          const ProblemInstance& instance);
};

#endif  // TRANSPORT_ROUTE_BUILDER_H
