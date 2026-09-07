#ifndef __BUSQUEDANOINFORMADA_H__
#define __BUSQUEDANOINFORMADA_H__

#include "CabecerasBusqueda.h"
#include <algorithm>
#include <fstream>
#include <iostream>
#include <set>
#include <sstream>
#include <vector>

void Usage(int argc, char *argv[]);
std::ifstream OpenFile(const std::string &filename);
int ReadNodes(std::ifstream &file);
std::vector<double> ReadDistances(std::ifstream &file, int &edges);
void InitializeNodes(Node *nodes[], int numNodes, const std::vector<double> &distances);
void WriteGraphInformation(const std::string &filename, Node *nodes[], int numNodes, int edges, const std::vector<double> &distances);

void WriteGraphInfo(std::ofstream &output_file, Node *nodes[], int numNodes, int numEdges, const std::vector<double> &distances);
void ImprimirArbolDesdeOrigen(std::ofstream &output_file, Node *nodes[], Node *nodoOrigen, std::set<Node *> &nodosVisitados, int nivel = 0);
void ImprimirArbolNGND(std::ofstream &output_file, Node *nodes[], Node *nodoOrigen, Node *nodoDestino, std::set<Node *> &nodosVisitados, int nivel = 0);

#endif // __BUSQUEDANOINFORMADA_H__