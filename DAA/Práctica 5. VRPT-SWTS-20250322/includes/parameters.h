/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Diseño y Análisis de Algoritmos
 * Práctica 5: VRPT-SWTS
 *
 * @file parameters.h
 * @brief Definition of the ProblemParameters struct and Tolerances struct
 * @author Álvaro Pérez Ramos - alu0101574042@ull.edu.es
 * @date 22/03/2025
 */
#ifndef __PARAMETERS_H__
#define __PARAMETERS_H__

#include <memory>
#include <vector>

#include "collectionZone.h"
#include "position.h"
#include "vehicle.h"
#include "soloidWasteTransferesStation.h"

/**
 * @brief Problem parameters and locations
 */
struct ProblemParameters {
  CollectionVehicle collection_vehicle;
  TransportVehicle transport_vehicle;
  int max_vehicles{0};
  int max_zones{0};
  int area_width{0}, area_height{0};
  Position depot;
  std::vector<SWTS> transfer_stations;
  Position landfill;
};

// Estructura para almacenar las tolerancias
struct Tolerances {
  int epsilon{0};
  int offset{0};
};

#endif  // PARAMETERS_H
