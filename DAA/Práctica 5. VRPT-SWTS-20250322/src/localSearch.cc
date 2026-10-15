#include "../includes/localSearch.h"

std::vector<MultistartSearch::Route> MultistartSearch::solve(
    const ProblemInstance& instance) {
  std::vector<Route> best_solution;
  double best_cost = std::numeric_limits<double>::max();

  // 2. Fase de mejora con búsqueda local
  local_search(collection_routes_, instance);

  // 3. Evaluar solución
  double current_cost = evaluate_solution(collection_routes_);

  if (current_cost < best_cost) {
    best_cost = current_cost;
    best_solution = collection_routes_;
  } else {
    // Si la solución no mejora, se reinicia
    collection_routes_.clear();
    collection_routes_ = best_solution;
  } 

  return best_solution;
}

void MultistartSearch::local_search(std::vector<Route>& solution,
                                    const ProblemInstance& instance) {
  double current_cost = evaluate_solution(solution);

  for (int i = 0; i < local_search_iterations_; ++i) {
    std::vector<Route> new_solution = solution;

    // Aplicar un movimiento aleatorio
    std::uniform_int_distribution<int> move_dist(0, 4);
    switch (move_dist(rng_)) {
      case 0:
        // std::cout << "Reinsertion move\n";
        reinsertion_move(new_solution, instance);
        break;
      case 1:
        // std::cout << "Swap move\n";
        swap_move(new_solution, instance);
        break;
      case 2:
        // std::cout << "2-opt move\n";
        two_opt_move(new_solution, instance);
        break;
      case 3:
        // std::cout << "Exchange move\n";
        exchange_move(new_solution, instance);
        break;
      // reiseriotn entre rutas
      case 4:
        // std::cout << "Reinsertion between routes move\n";
        reinsertion_between_routes(new_solution, instance);
        break;
      default:
        throw std::runtime_error("Invalid move type");
        break;  // No hacer nada
    }

    // Evaluar nueva solución
    double new_cost = evaluate_solution(new_solution);

    if (new_cost < current_cost) {
      solution = new_solution;
      current_cost = new_cost;
      i = -1;  // Reiniciar iteraciones si hay mejora
    }
  }
}

// Movimiento de reinserción (relocate)
void MultistartSearch::reinsertion_move(std::vector<Route>& solution,
                                        const ProblemInstance& instance) {
  if (solution.empty()) return;

  // Seleccionar ruta origen y destino (pueden ser iguales)
  std::uniform_int_distribution<int> route_dist(0, solution.size() - 1);
  int from_route = route_dist(rng_);
  int to_route = route_dist(rng_);

  if (solution[from_route].path.size() < 2) return;

  // Seleccionar nodo a mover (excluyendo depósito/SWTS)
  std::uniform_int_distribution<int> node_dist(
      1, solution[from_route].path.size() - 2);
  int node_pos = node_dist(rng_);
  int node = solution[from_route].path[node_pos];

  // Insertar en posición aleatoria en ruta destino
  std::uniform_int_distribution<int> insert_dist(
      1, solution[to_route].path.size() - 1);
  int insert_pos = insert_dist(rng_);

  // Realizar movimiento
  solution[from_route].path.erase(solution[from_route].path.begin() + node_pos);
  solution[to_route].path.insert(solution[to_route].path.begin() + insert_pos,
                                 node);

  // Recalcular métricas (simplificado)
  // En una implementación real necesitarías recalcular distancias y tiempos

  if (!is_feasible(solution[from_route], instance) ||
      !is_feasible(solution[to_route], instance)) {
    // Deshacer si no es factible
    solution[to_route].path.erase(solution[to_route].path.begin() + insert_pos);
    solution[from_route].path.insert(
        solution[from_route].path.begin() + node_pos, node);
  }
}

// Movimiento de intercambio (swap)
void MultistartSearch::swap_move(std::vector<Route>& solution,
                                 const ProblemInstance& instance) {
  if (solution.empty()) return;

  // Seleccionar dos rutas (pueden ser iguales)
  std::uniform_int_distribution<int> route_dist(0, solution.size() - 1);
  int route1 = route_dist(rng_);
  int route2 = route_dist(rng_);

  if (solution[route1].path.size() < 2 || solution[route2].path.size() < 2)
    return;

  // Seleccionar nodos a intercambiar (excluyendo depósito/SWTS)
  std::uniform_int_distribution<int> node1_dist(
      1, solution[route1].path.size() - 2);
  std::uniform_int_distribution<int> node2_dist(
      1, solution[route2].path.size() - 2);

  int node1_pos = node1_dist(rng_);
  int node2_pos = node2_dist(rng_);

  // Realizar intercambio
  std::swap(solution[route1].path[node1_pos], solution[route2].path[node2_pos]);

  // Verificar factibilidad
  if (!is_feasible(solution[route1], instance) ||
      !is_feasible(solution[route2], instance)) {
    // Deshacer si no es factible
    std::swap(solution[route1].path[node1_pos],
              solution[route2].path[node2_pos]);
  }
}

// Movimiento 2-opt
void MultistartSearch::two_opt_move(std::vector<Route>& solution,
                                    const ProblemInstance& instance) {
  if (solution.empty()) return;

  // Seleccionar una ruta aleatoria
  std::uniform_int_distribution<int> route_dist(0, solution.size() - 1);
  int route_idx = route_dist(rng_);
  auto& route = solution[route_idx];

  if (route.path.size() < 4) return;

  // Seleccionar dos posiciones para invertir el segmento intermedio
  std::uniform_int_distribution<int> pos1_dist(1, route.path.size() - 3);
  int i = pos1_dist(rng_);
  std::uniform_int_distribution<int> pos2_dist(i + 1, route.path.size() - 2);
  int j = pos2_dist(rng_);

  // Invertir segmento
  std::reverse(route.path.begin() + i, route.path.begin() + j + 1);

  // Verificar factibilidad
  if (!is_feasible(route, instance)) {
    // Deshacer si no es factible
    std::reverse(route.path.begin() + i, route.path.begin() + j + 1);
  }
}

// Movimiento de intercambio entre rutas (exchange)
void MultistartSearch::exchange_move(std::vector<Route>& solution,
                                     const ProblemInstance& instance) {
  if (solution.size() < 2) return;

  // Seleccionar dos rutas diferentes
  std::uniform_int_distribution<int> route_dist(0, solution.size() - 1);
  int route1 = route_dist(rng_);
  int route2 = route_dist(rng_);
  while (route2 == route1) {
    route2 = route_dist(rng_);
  }

  if (solution[route1].path.size() < 2 || solution[route2].path.size() < 2)
    return;

  // Seleccionar segmentos para intercambiar
  // (implementación simplificada - intercambiar un nodo de cada ruta)
  std::uniform_int_distribution<int> node1_dist(
      1, solution[route1].path.size() - 2);
  std::uniform_int_distribution<int> node2_dist(
      1, solution[route2].path.size() - 2);

  int node1_pos = node1_dist(rng_);
  int node2_pos = node2_dist(rng_);

  // Realizar intercambio
  std::swap(solution[route1].path[node1_pos], solution[route2].path[node2_pos]);

  // Verificar factibilidad
  if (!is_feasible(solution[route1], instance) ||
      !is_feasible(solution[route2], instance)) {
    // Deshacer si no es factible
    std::swap(solution[route1].path[node1_pos],
              solution[route2].path[node2_pos]);
  }
}

// Movimiento de reinserción entre rutas
void MultistartSearch::reinsertion_between_routes(
    std::vector<Route>& solution, const ProblemInstance& instance) {
  if (solution.size() < 2) return;

  // Seleccionar dos rutas diferentes
  std::uniform_int_distribution<int> route_dist(0, solution.size() - 1);
  int from_route = route_dist(rng_);
  int to_route = route_dist(rng_);
  while (to_route == from_route) {
    to_route = route_dist(rng_);
  }

  if (solution[from_route].path.size() < 2) return;

  // Seleccionar nodo a mover (excluyendo depósito/SWTS)
  std::uniform_int_distribution<int> node_dist(
      1, solution[from_route].path.size() - 2);
  int node_pos = node_dist(rng_);
  int node = solution[from_route].path[node_pos];

  // Insertar en posición aleatoria en ruta destino
  std::uniform_int_distribution<int> insert_dist(
      1, solution[to_route].path.size() - 1);
  int insert_pos = insert_dist(rng_);

  // Realizar movimiento
  solution[from_route].path.erase(solution[from_route].path.begin() + node_pos);
  solution[to_route].path.insert(solution[to_route].path.begin() + insert_pos,
                                 node);

  // Verificar factibilidad
  if (!is_feasible(solution[from_route], instance) ||
      !is_feasible(solution[to_route], instance)) {
    // Deshacer si no es factible
    solution[to_route].path.erase(solution[to_route].path.begin() + insert_pos);
    solution[from_route].path.insert(
        solution[from_route].path.begin() + node_pos, node);
  }
}

double MultistartSearch::evaluate_solution(
    const std::vector<Route>& solution) const {
  double total_distance = 0.0;
  for (const auto& route : solution) {
    total_distance += route.total_distance;
  }
  return total_distance;
}

bool MultistartSearch::is_feasible(const Route& route,
                                   const ProblemInstance& instance) const {
  const auto& params = instance.parameters();
  return (route.total_time <= params.collection_vehicle.maxDuration()) &&
         (route.total_demand <= params.collection_vehicle.capacity());
}