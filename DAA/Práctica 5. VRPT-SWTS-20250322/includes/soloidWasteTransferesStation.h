/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Diseño y Análisis de Algoritmos
 * Práctica 5: VRPT-SWTS
 *
 * @file solidWasteTransferesStation.h
 * @brief Definition of the SWTS class
 * @author Álvaro Pérez Ramos - alu0101574042@ull.edu.es
 * @date 22/03/2025
 */
#ifndef __SOLIDWASTETRANSFERSTATION_H__
#define __SOLIDWASTETRANSFERSTATION_H__

#include "position.h"

class SWTS {
 public:
  /**
   * @brief Default constructor for SWTS
   */
  SWTS() = default;
  
  /**
   * @brief Construct a new SWTS object
   * @param id - Id of the SWTS
   * @param position - Position of the SWTS
   */
  SWTS(int id, Position position) : id(id), position(position) {}

  /**
   * @brief Get the id of the SWTS
   * @return int - Id of the SWTS
   */
  int getId() const { return id; }

  /**
   * @brief Get the position of the SWTS
   * @return Position - Position of the SWTS
   */
  Position getPosition() const { return position; }

 private:
  int id{0};
  Position position = {0.0, 0.0};
};

#endif  // __SOLIDWASTETRANSFERSTATION_H__