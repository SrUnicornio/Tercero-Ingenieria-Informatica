#include "../include/greedy.h"

Solution Greedy::Run(const Problem& problem) {
  startTimer();

  Solution solution;
  const auto& elements = problem.getElements();
  size_t m = problem.getSubDimension();

  if (elements.empty() || m == 0) {
    stopTimer();
    return solution;
  }

  // Step 1: Select the point farthest from the global centroid
  std::vector<double> global_centroid(problem.getDimension(), 0.0);
  for (const auto& point : elements) {
    const auto& coords = point.getCoordinates();
    for (size_t i = 0; i < coords.size(); ++i) {
      global_centroid[i] += coords[i];
    }
  }
  for (auto& coord : global_centroid) {
    coord /= elements.size();
  }
  Point centroid("centroid", global_centroid);

  size_t farthest_index = 0;
  double max_distance = 0.0;
  for (size_t i = 0; i < elements.size(); ++i) {
    double distance = elements[i].distanceTo(centroid);
    if (distance > max_distance) {
      max_distance = distance;
      farthest_index = i;
    }
  }
  solution.addPoint(elements[farthest_index]);

  // Step 2: Iteratively add the point farthest from the current solution
  // centroid
  while (solution.size() < m) {
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

    max_distance = 0.0;
    farthest_index = 0;
    for (size_t i = 0; i < elements.size(); ++i) {
      bool already_selected = false;
      for (const auto& selected : selected_points) {
        if (elements[i].getName() == selected.getName()) {
          already_selected = true;
          break;
        }
      }
      if (!already_selected) {
        double distance = elements[i].distanceTo(current_centroid_point);
        if (distance > max_distance) {
          max_distance = distance;
          farthest_index = i;
        }
      }
    }
    solution.addPoint(elements[farthest_index]);
  }

  stopTimer();
  return solution;
}