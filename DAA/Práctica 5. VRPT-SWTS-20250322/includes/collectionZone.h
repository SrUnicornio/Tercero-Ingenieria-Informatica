/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Diseño y Análisis de Algoritmos
 * Práctica 5: VRPT-SWTS
 *
 * @file colection_zone.h
 * @brief Definition of the CollectionZone class
 * @author Álvaro Pérez Ramos - alu0101574042@ull.edu.es
 * @date 22/03/2025
 */
#ifndef __COLLECTION_ZONE_H__
#define __COLLECTION_ZONE_H__

#include "position.h"

class CollectionZone {
 public:
  /**
   * @brief Default constructor for CollectionZone
   */
  CollectionZone() = default;

  /**
   * @brief Construct a new Collection Zone object
   * @param id - Id of the zone
   * @param position - Position of the zone
   * @param demand - Demand of the zone D2-D1
   */
  CollectionZone(int id, Position position, double collection_time,
                 double demand)
      : id_(id),
        position_(position),
        collection_time_(collection_time),
        demand_(demand) {}

  /**
   * @brief Get the id of the zone
   * @return int - Id of the zone
   */
  int getId() const { return id_; }

  /**
   * @brief Get the position of the zone
   * @return Position - Position of the zone
   */
  Position getPosition() const { return position_; }

  /**
   * @brief Get the time of recolection of the zone
   * @return double - Time of recolection of the zone
   */
  double getTimeRecolection() const { return collection_time_; }

  /**
   * @brief Get the demand of the zone
   * @return double - Demand of the zone for the first type of waste
   */
  double getDemand() const { return demand_; }

 private:
  int id_{0};
  Position position_ = {0.0, 0.0};
  double collection_time_{0.0};  // Tiempo de recolección
  double demand_{0.0};
};

#endif  // __COLLECTION_ZONE_H__