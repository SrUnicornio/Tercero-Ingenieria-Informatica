#include "../includes/gvns.h"

std::vector<RouteBuilder::Route> GeneralVariableNeighborhoodSearch::solve(
    const ProblemInstance& instance) {
  // 1. Generar solución inicial con GRASP (usando la implementación del padre)
  std::vector<Route> current_solution = MultistartSearch::solve(instance);
  std::vector<Route> best_solution = current_solution;
  double best_cost = evaluate_solution(best_solution);

  int k = 1;
  while (k <= kmax_) {
    // 2. Fase de perturbación (shake)
    std::vector<Route> perturbed_solution = current_solution;

    if (k % 3 == 1)
      perturb_by_random_swaps(perturbed_solution, k, instance);
    else if (k % 3 == 2)
      perturb_by_route_merge(perturbed_solution, k, instance);
    else
      perturb_by_route_split(perturbed_solution, k, instance);

    // 3. Reparar solución si es necesario
    repair_solution(perturbed_solution, instance);

    // 4. Búsqueda local (usando VND del padre)
    local_search(perturbed_solution, instance);
    double perturbed_cost = evaluate_solution(perturbed_solution);

    // 5. Criterio de aceptación
    if (perturbed_cost < best_cost) {
      best_solution = perturbed_solution;
      best_cost = perturbed_cost;
      current_solution = perturbed_solution;
      k = 1;  // Reiniciar el tamaño del vecindario
    } else {
      k++;  // Incrementar el tamaño del vecindario
    }
  }

  return best_solution;
}

void GeneralVariableNeighborhoodSearch::perturb_by_random_swaps(
    std::vector<Route>& solution, int k, const ProblemInstance& instance) {
  if (solution.size() < 2) return;

  for (int i = 0; i < k; ++i) {
    // Seleccionar dos rutas aleatorias
    std::uniform_int_distribution<int> route_dist(0, solution.size() - 1);
    int route1 = route_dist(rng_);
    int route2 = route_dist(rng_);
    while (route2 == route1) route2 = route_dist(rng_);

    if (solution[route1].path.size() < 2 || solution[route2].path.size() < 2)
      continue;

    // Seleccionar nodos aleatorios para intercambiar
    std::uniform_int_distribution<int> node1_dist(
        1, solution[route1].path.size() - 2);
    std::uniform_int_distribution<int> node2_dist(
        1, solution[route2].path.size() - 2);

    int node1_pos = node1_dist(rng_);
    int node2_pos = node2_dist(rng_);

    // Intercambiar nodos
    std::swap(solution[route1].path[node1_pos],
              solution[route2].path[node2_pos]);

    // Actualizar métricas de las rutas afectadas
    update_route_metrics(solution[route1], instance);
    update_route_metrics(solution[route2], instance);
  }
}

void GeneralVariableNeighborhoodSearch::perturb_by_route_merge(
    std::vector<Route>& solution, int k, const ProblemInstance& instance) {
  if (solution.size() < 2) return;

  for (int i = 0; i < std::min(k, static_cast<int>(solution.size() - 1)); ++i) {
    // Seleccionar dos rutas aleatorias para fusionar
    std::uniform_int_distribution<int> route_dist(0, solution.size() - 1);
    int route1 = route_dist(rng_);
    int route2 = route_dist(rng_);
    while (route2 == route1) route2 = route_dist(rng_);

    // Verificar capacidad y tiempo antes de fusionar
    double combined_demand =
        solution[route1].total_demand + solution[route2].total_demand;
    double combined_time =
        solution[route1].total_time + solution[route2].total_time;

    if (combined_demand > instance.parameters().collection_vehicle.capacity() ||
        combined_time >
            instance.parameters().collection_vehicle.maxDuration()) {
      continue;  // No fusionar si viola las restricciones
    }

    // Fusionar ruta2 en ruta1
    solution[route1].path.insert(solution[route1].path.end(),
                                 solution[route2].path.begin() + 1,
                                 solution[route2].path.end() - 1);

    // Actualizar métricas
    solution[route1].total_distance += solution[route2].total_distance;
    solution[route1].total_demand = combined_demand;
    solution[route1].total_time = combined_time;
    solution[route1].subroutes += solution[route2].subroutes + 1;

    // Eliminar ruta2
    solution.erase(solution.begin() + route2);
  }
}

void GeneralVariableNeighborhoodSearch::repair_solution(
    std::vector<Route>& solution, const ProblemInstance& instance) {
  for (auto& route : solution) {
    // Verificar factibilidad
    if (!is_feasible(route, instance)) {
      // Estrategia de reparación simple: dividir la ruta en dos
      if (route.path.size() > 4) {
        Route new_route;
        size_t split_pos = route.path.size() / 2;

        new_route.path.insert(new_route.path.end(),
                              route.path.begin() + split_pos, route.path.end());
        route.path.erase(route.path.begin() + split_pos, route.path.end());

        // Añadir depósitos
        route.path.push_back(-1);
        new_route.path.push_back(-1);

        // Recalcular métricas
        update_route_metrics(route, instance);
        update_route_metrics(new_route, instance);

        solution.push_back(new_route);
      }
    }
  }
}

void GeneralVariableNeighborhoodSearch::perturb_by_route_split(
    std::vector<Route>& solution, int k, const ProblemInstance& instance) {
  if (solution.empty()) return;

  for (int i = 0; i < k; ++i) {
    // Seleccionar una ruta aleatoria para dividir
    std::uniform_int_distribution<int> route_dist(0, solution.size() - 1);
    int route_idx = route_dist(rng_);
    auto& route = solution[route_idx];

    if (route.path.size() < 4) continue;  // Ruta demasiado corta para dividir

    // Seleccionar punto de división aleatorio
    std::uniform_int_distribution<int> split_dist(1, route.path.size() - 2);
    int split_pos = split_dist(rng_);

    // Crear nueva ruta
    Route new_route;
    new_route.path.insert(new_route.path.end(), route.path.begin() + split_pos,
                          route.path.end());
    route.path.erase(route.path.begin() + split_pos, route.path.end());

    // Agregar depósito al final de ambas rutas
    route.path.push_back(-1);
    new_route.path.push_back(-1);

    // Recalcular métricas (simplificado, debería usar update_route_metrics)
    new_route.total_distance = route.total_distance / 2;
    route.total_distance /= 2;
    new_route.total_demand = route.total_demand / 2;
    route.total_demand /= 2;
    new_route.total_time = route.total_time / 2;
    route.total_time /= 2;
    new_route.subroutes = route.subroutes / 2;
    route.subroutes /= 2;

    solution.push_back(new_route);
  }
}

// Helper para actualizar métricas de una ruta
void GeneralVariableNeighborhoodSearch::update_route_metrics(
    Route& route, const ProblemInstance& instance) {
  // Resetear métricas
  route.total_distance = 0;
  route.total_demand = 0;
  route.total_time = 0;
  route.subroutes = 0;

  const auto& zones = instance.CollectionZones();
  const auto& distances = instance.distances();
  const double speed = instance.parameters().collection_vehicle.speed();

  if (route.path.empty()) return;

  // Calcular desde el principio
  int prev_stop = route.path[0];
  for (size_t i = 1; i < route.path.size(); ++i) {
    int current_stop = route.path[i];
    double dist = distance_calculator_->get_distance(prev_stop, current_stop,
                                                     distances, zones.size());

    route.total_distance += dist;
    route.total_time += (dist / speed) * 60;

    if (current_stop >= 0) {  // Es una zona de recolección
      route.total_demand += zones[current_stop].getDemand();
      route.total_time += zones[current_stop].getTimeRecolection();
    } else if (current_stop <= -2) {  // Es una estación de transferencia
      route.subroutes++;
    }

    prev_stop = current_stop;
  }
}