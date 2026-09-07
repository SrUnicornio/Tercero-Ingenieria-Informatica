#ifndef __NODOGESTOR_H__
#define __NODOGESTOR_H__

#include "Node.h"
#include <vector>
#include <iostream>
#include <stdexcept>

class NodoInexistenteException : public std::runtime_error
{
public:
  NodoInexistenteException(const std::string &msg) : std::runtime_error(msg) {}
};

void FillSuccessors(Node *nodes[], const std::vector<double> &distances, int numNodes);
void createNodes(Node *nodes[], int numNodes);
void deleteNodes(Node *nodes[], int numNodes);
void AskForNodes(int &originNode, int &destinationNode, int numNodes);

#endif // __NODOGESTOR_H__