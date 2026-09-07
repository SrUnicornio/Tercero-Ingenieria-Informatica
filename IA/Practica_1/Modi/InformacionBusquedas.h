#ifndef __INFORMACIONBUSQUEDAS_H__
#define __INFORMACIONBUSQUEDAS_H__

#include "Node.h"

// Funciones modulares
void ImprimirNodosGenerados(const std::vector<Node *> &nodos_generados, std::ofstream &output_file);
void ImprimirNodosInspeccionados(const std::vector<Node *> &nodos_inspeccionados, std::ofstream &output_file);
void ImprimirSeparador(std::ofstream &output_file);
void ImprimirCaminoInfo(const std::vector<Node *> &camino, std::ofstream &output_file);

#endif // __INFORMACIONBUSQUEDAS_H__