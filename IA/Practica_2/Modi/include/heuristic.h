/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Inteligencia Artifical
 * Curso: 3º
 * Práctica 2: Busqueda A*
 * Autor: Álvaro Pérez Ramos
 * Correo: alu0101574042@ull.edu.es
 * Fecha: 18/09/2024
 * Archivo heuristic.h: declaraion de funciones heurísticas para la busqueda A*
 */
#ifndef __HEURISTIC_H__
#define __HEURISTIC_H__

#include "position.h"
#include <cmath>

// Función para calcular la heurística h(n) usando distancia de Manhattan
int heuristicManhattan(const Position &current, const Position &end, int W = 3);

// Función para calcular la heurística h(n) usando distancia Euclidiana
double heuristicEuclidean(const Position &current, const Position &end, double W = 3.5);

#endif // __HEURISTIC_H__
