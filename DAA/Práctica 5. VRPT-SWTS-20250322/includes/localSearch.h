#ifndef __MULTISTART_H__
#define __MULTISTART_H__

#include <algorithm>
#include <memory>
#include <random>
#include <vector>

#include "grasp.h"
#include "problemInstance.h"
#include "routeBuilder.h"

class MultistartSearch {
 public:
  using Route = RouteBuilder::Route;

  MultistartSearch(std::unique_ptr<DistanceService> calculator,
                   std::vector<Route> collection_routes,
                   int local_search_iterations = 1000)
      : distance_calculator_(std::move(calculator)),
        collection_routes_(std::move(collection_routes)),
        local_search_iterations_(local_search_iterations),      
        rng_{0} {}

  virtual std::vector<Route> solve(const ProblemInstance& instance);

 protected:
  std::unique_ptr<DistanceService> distance_calculator_;
  std::vector<Route> collection_routes_;
  int local_search_iterations_;
  std::mt19937 rng_;

  // Movimientos de búsqueda local
  // Movimiento de reinserción
  void reinsertion_move(std::vector<Route>& solution,
                        const ProblemInstance& instance);
  // Movimiento de intercambio (swap)
  void swap_move(std::vector<Route>& solution, const ProblemInstance& instance);
  // Movimiento de 2-opt
  void two_opt_move(std::vector<Route>& solution,
                    const ProblemInstance& instance);
  // Movimiento de intercambio entre rutas
  void exchange_move(std::vector<Route>& solution,
                     const ProblemInstance& instance);
  // Movimiento de reinserción entre rutas
  void reinsertion_between_routes(std::vector<Route>& solution,
                                  const ProblemInstance& instance);

  // Función de evaluación
  double evaluate_solution(const std::vector<Route>& solution) const;

  // Función para verificar factibilidad
  bool is_feasible(const Route& route, const ProblemInstance& instance) const;

  // Búsqueda local
  void local_search(std::vector<Route>& solution,
                    const ProblemInstance& instance);
};

#endif  // __MULTISTART_H__