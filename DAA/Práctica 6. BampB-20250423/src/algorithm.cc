#include "../include/algorithm.h"

void Algorithm::startTimer() {
  // time in ms
  start_time_ = std::chrono::high_resolution_clock::now();
}

void Algorithm::stopTimer() {
  auto end_time = std::chrono::high_resolution_clock::now();
  execution_time_ = std::chrono::duration<double>(end_time - start_time_).count();
}

double Algorithm::CalculateTotalDistance(const Solution& solution) {
  double total_distance = 0.0;
  const auto& points = solution.getSelectedPoints();
  for (size_t i = 0; i < points.size(); ++i) {
    for (size_t j = i + 1; j < points.size(); ++j) {
      total_distance += points[i].distanceTo(points[j]);
    }
  }
  return total_distance;
}

double Algorithm::CalculateDistanceToCentroid(const Solution& solution) {
  const auto& points = solution.getSelectedPoints();
  if (points.empty()) return 0.0;

  std::vector<double> centroid(points[0].getDimension(), 0.0);
  for (const auto& point : points) {
    const auto& coords = point.getCoordinates();
    for (size_t i = 0; i < coords.size(); ++i) {
      centroid[i] += coords[i];
    }
  }

  for (auto& coord : centroid) {
    coord /= points.size();
  }

  Point centroid_point("centroid", centroid);
  double total_distance = 0.0;
  for (const auto& point : points) {
    total_distance += point.distanceTo(centroid_point);
  }

  return total_distance;
}