#include "../include/local-search.h"
#include <numeric>  
#include <algorithm>  
#include <random>

Solution LocalSearch::Run(const Problem& problem) {
  startTimer();

  // Start with a random solution
  std::vector<Point> selected_points;
  std::vector<size_t> indices(problem.getSize());
  std::iota(indices.begin(), indices.end(), 0);
  std::shuffle(indices.begin(), indices.end(),
               std::mt19937{std::random_device{}()});

  for (size_t i = 0; i < problem.getSubDimension(); ++i) {
    selected_points.push_back(problem.getElement(indices[i]));
  }

  Solution solution(selected_points);
  double current_diversity = CalculateTotalDistance(solution);
  bool improved = true;
  int iterations = 0;

  while (improved && iterations < max_iterations_) {
    improved = false;
    iterations++;

    // Try all possible swaps
    for (size_t i = 0; i < solution.size(); ++i) {
      for (size_t j = 0; j < problem.getSize(); ++j) {
        // Check if point j is not already in the solution
        bool already_in_solution = false;
        for (const auto& point : solution.getSelectedPoints()) {
          if (problem.getElement(j).getName() == point.getName()) {
            already_in_solution = true;
            break;
          }
        }

        if (!already_in_solution) {
          // Create neighbor solution by swapping
          Solution neighbor = solution;
          neighbor.getSelectedPoints()[i] = problem.getElement(j);

          double neighbor_diversity = CalculateTotalDistance(neighbor);
          if (neighbor_diversity > current_diversity) {
            solution = neighbor;
            current_diversity = neighbor_diversity;
            improved = true;
            break;  // First improvement strategy
          }
        }
      }
      if (improved) break;
    }
  }

  stopTimer();
  return solution;
}
