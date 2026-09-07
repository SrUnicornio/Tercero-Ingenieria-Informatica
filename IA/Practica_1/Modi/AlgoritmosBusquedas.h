#ifndef __ALGORITMOSBUSQUEDA_H__
#define __ALGORITMOSBUSQUEDA_H__

#include "InformacionBusquedas.h"
#include <algorithm>
#include <fstream>
#include <iostream>
#include <map>
#include <queue>
#include <stack>
#include <set>

void BFS_sin_memoria(Node *raiz, Node *destino, std::ofstream &output_file);
void DFS(std::ofstream &output_file, Node *nodes[], Node *currentNode, std::vector<Node *> &visitedNodes, std::vector<Node *> &path, Node *destinationNode, int iteracion = 1);

// Modifications
void BFS(Node *origin_node, Node *destination_node, std::ofstream &output_file);
void DFS_Iterativo(std::ofstream &output_file, Node *currentNode, std::vector<Node *> &visitedNodes, Node *destinationNode, int iteracion = 1);

void PrintTraza(std::ofstream &output_file, Node *current_node, std::vector<Node *> &visited_nodes, std::vector<Node *> &path, int iteracion);

// Modi calse
void BFS_MultiArranque(Node *origin_node, Node *destination_node, std::ofstream &output_file);

#endif // __ALGORITMOSBUSQUEDA_H__