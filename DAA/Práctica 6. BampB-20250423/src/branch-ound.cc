#include <limits>

#include "../include/branch-bound.h"

Solution BranchBound::Run(const Problem& problem) {
  startTimer();
  nodes_generated_ = 0;  // Resetear contador al inicio

  const int n = problem.getSize();
  const int m = problem.getSubDimension();

  // Inicializar la mejor solución
  Greedy greedy_algorithm;
  Solution initial_solution = greedy_algorithm.Run(problem);
  Solution best_solution = initial_solution;
  double best_diversity = 
      Algorithm::CalculateTotalDistance(initial_solution);

  // Cola de prioridad para nodos vivos (ordenados por cota superior)
  std::priority_queue<Node> live_nodes;

  // Nodo raíz
  Node root;
  root.included = std::vector<bool>(n, false);
  root.current_diversity = 0.0;
  root.level = 0;
  root.last_added = -1;
  root.upper_bound = CalculateUpperBound(problem, root);

  nodes_generated_++;  // Contar el nodo raíz
  live_nodes.push(root);

  while (!live_nodes.empty()) {
    Node current = live_nodes.top();
    live_nodes.pop();

    // Poda: si la cota es peor que la mejor solución conocida
    if (current.upper_bound <= best_diversity) {
      continue;
    }

    // Si es una solución completa
    if (current.level == m) {
      if (current.current_diversity > best_diversity) {
        best_diversity = current.current_diversity;
        best_solution = BuildSolution(problem, current);
      }
      continue;
    }

    // Generar nodos hijos
    for (int i = current.last_added + 1; i < n; ++i) {
      if (!current.included[i]) {
        Node child = current;
        child.included[i] = true;
        child.level = current.level + 1;
        child.last_added = i;

        // Calcular nueva diversidad
        child.current_diversity +=
            ComputeDiversityContribution(problem, i, current.included);

        // Calcular cota superior
        child.upper_bound = CalculateUpperBound(problem, child);

        nodes_generated_++;  // Contar cada nuevo nodo generado

        // Solo añadir si puede mejorar la mejor solución
        if (child.upper_bound > best_diversity) {
          live_nodes.push(child);

          // Actualizar mejor solución si encontramos una completa
          if (child.level == m && child.current_diversity > best_diversity) {
            best_diversity = child.current_diversity;
            best_solution = BuildSolution(problem, child);
          }
        }
      }
    }
  }

  stopTimer();
  return best_solution;
}

// Resto de las implementaciones de métodos permanecen igual...
double BranchBound::CalculateUpperBound(const Problem& problem,
                                              const Node& node) const {
  const int n = problem.getSize();
  const int m = problem.getSubDimension();
  const int remaining = m - node.level;

  if (remaining == 0) {
    return node.current_diversity;
  }

  double bound = node.current_diversity;
  std::vector<double> contributions;

  // Calcular contribuciones potenciales de puntos no incluidos
  for (int i = 0; i < n; ++i) {
    if (!node.included[i]) {
      double contrib = ComputeDiversityContribution(problem, i, node.included);

      // Estimación optimista: considerar también contribuciones entre puntos no
      // incluidos
      for (int j = i + 1; j < n && remaining > 1; ++j) {
        if (!node.included[j]) {
          contrib += problem.getElement(i).distanceTo(problem.getElement(j));
        }
      }
      contributions.push_back(contrib);
    }
  }

  // Ordenar contribuciones de mayor a menor
  std::sort(contributions.rbegin(), contributions.rend());

  // Sumar las 'remaining' mayores contribuciones
  const int size = contributions.size();
  for (int i = 0; i < remaining && i < size; ++i) {
    bound += contributions[i];
  }

  return bound;
}

double BranchBound::ComputeDiversityContribution(
    const Problem& problem, int point_idx,
    const std::vector<bool>& included) const {
  double contribution = 0.0;
  for (size_t i = 0; i < included.size(); ++i) {
    if (included[i]) {
      contribution +=
          problem.getElement(point_idx).distanceTo(problem.getElement(i));
    }
  }
  return contribution;
}

Solution BranchBound::BuildSolution(const Problem& problem,
                                          const Node& node) const {
  std::vector<Point> selected_points;
  for (size_t i = 0; i < node.included.size(); ++i) {
    if (node.included[i]) {
      selected_points.push_back(problem.getElement(i));
    }
  }
  return Solution(selected_points);
}