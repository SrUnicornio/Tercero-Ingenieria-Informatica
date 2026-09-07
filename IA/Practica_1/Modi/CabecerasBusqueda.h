#ifndef __BUSQUEDAS_H__
#define __BUSQUEDAS_H__

#include "AlgoritmosBusquedas.h"
#include "NodeGestor.h"
#include <algorithm>

void PerformSearches(Node *nodes[], int originNode, int destinationNode, int numNodes, int edges);
void PrintDFSHeader(std::ofstream &output_file, int numNodes, int edges, int originNode, int destinationNode);
void PrintBFSHeader(std::ofstream &output_file, int numNodes, int edges, int originNode, int destinationNode);
void ChooseSearch(Node *nodes[], int originNode, int destinationNode, int numNodes, int edges, int searchType);
#endif // __BUSQUEDAS_H__