#include <algorithm>
#include <random>

#include "../include/grasp.h"

Solution GRASP::ConstructivePhase(const Problem& problem) {
  Solution solution;
  const auto& elements = problem.getElements();
  size_t m = problem.getSubDimension();

  if (elements.empty() || m == 0) {
    return solution;
  }

  // Create candidate list
  std::vector<size_t> candidates;
  for (size_t i = 0; i < elements.size(); ++i) {
    candidates.push_back(i);
  }

  // Select first point randomly
  std::uniform_int_distribution<size_t> dist(0, elements.size() - 1);
  size_t first_point = dist(rng_);
  solution.addPoint(elements[first_point]);
  candidates.erase(
      std::remove(candidates.begin(), candidates.end(), first_point),
      candidates.end());

  // Greedy randomized construction
  while (solution.size() < m) {
    // Calculate distances to current solution
    std::vector<double> distances;
    std::vector<double> current_centroid(problem.getDimension(), 0.0);
    const auto& selected_points = solution.getSelectedPoints();
    for (const auto& point : selected_points) {
      const auto& coords = point.getCoordinates();
      for (size_t i = 0; i < coords.size(); ++i) {
        current_centroid[i] += coords[i];
      }
    }
    for (auto& coord : current_centroid) {
      coord /= selected_points.size();
    }
    Point current_centroid_point("current_centroid", current_centroid);

    for (size_t i : candidates) {
      distances.push_back(elements[i].distanceTo(current_centroid_point));
    }

    // Create Restricted Candidate List (RCL)
    double max_dist = *std::max_element(distances.begin(), distances.end());
    double min_dist = *std::min_element(distances.begin(), distances.end());
    double threshold = max_dist - 0.3 * (max_dist - min_dist);  // Alpha = 0.3

    std::vector<size_t> rcl_indices;
    for (size_t i = 0; i < distances.size(); ++i) {
      if (distances[i] >= threshold) {
        rcl_indices.push_back(i);
      }
    }

    // Randomly select from RCL
    if (!rcl_indices.empty()) {
      std::uniform_int_distribution<size_t> rcl_dist(0, rcl_indices.size() - 1);
      size_t selected_candidate_index = rcl_indices[rcl_dist(rng_)];
      size_t selected_element_index = candidates[selected_candidate_index];
      solution.addPoint(elements[selected_element_index]);
      candidates.erase(candidates.begin() + selected_candidate_index);
    } else {
      // Fallback: select the farthest
      auto max_it = std::max_element(distances.begin(), distances.end());
      size_t selected_candidate_index =
          std::distance(distances.begin(), max_it);
      size_t selected_element_index = candidates[selected_candidate_index];
      solution.addPoint(elements[selected_element_index]);
      candidates.erase(candidates.begin() + selected_candidate_index);
    }
  }

  return solution;
}

Solution GRASP::Run(const Problem& problem) {
  startTimer();

  Solution best_solution;
  double best_diversity = 0.0;

  for (int iter = 0; iter < max_iterations_; ++iter) {
    Solution solution = ConstructivePhase(problem);
    // solution = LocalSearch(problem, solution);

    double current_diversity = CalculateTotalDistance(solution);
    if (current_diversity > best_diversity) {
      best_solution = solution;
      best_diversity = current_diversity;
    }
  }

  stopTimer();
  return best_solution;
}
