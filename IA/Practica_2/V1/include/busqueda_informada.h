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
 * Archivo busqueda_informada.h: declaracion de funciones para el desarrollo de la busqeuda A*
 */
#ifndef __BUSQUEDA_INFORMADA_H__
#define __BUSQUEDA_INFORMADA_H__

#include "astar.h"
#include "direction.h" // Asegúrate de incluir Direction.h
#include "heuristic.h"
#include "laberinto.h"
#include <fstream>
#include <iostream>
#include <vector>

void Usage(int argc, char *argv[]);
bool LoadLaberinto(const std::string &filename, Laberinto &laberinto, int &rows, int &cols);
void WriteLaberintoToFile(const Laberinto &laberinto, const std::string &filename);
bool FindStartAndEnd(const Laberinto &laberinto, Position &start, Position &end);
bool EsPosicionTransitible(const Laberinto &laberinto, int fila, int columna);
bool CambiarPosiciones(Position &start, Position &end, Laberinto &laberinto);
bool EsPosicionEnBorde(int fila, int columna, int rows, int cols);

#endif //__BUSQUEDA_INFORMADA_H__