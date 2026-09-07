#ifndef __NODE_H__
#define __NODE_H__

#include <iostream>
#include <vector>
#include <fstream>

class Node
{
private:
  int value;                                       // Valor del nodo
  Node *parent;                                    // Puntero al nodo padre
  std::vector<std::pair<Node *, double>> children; // Vector que almacena pares (hijo, distancia)

public:
  // Constructor
  Node(int val) : value(val), parent(nullptr) {}

  ~Node() { children.clear(); }

  // Método para obtener el valor del nodo
  int getValue() const { return value; }
  Node *getParent() const { return parent; }
  const std::vector<std::pair<Node *, double>> &getChildren() const { return children; }
  double getDistanceToChild(Node *child) const;
  void setParent(Node *newParent) { parent = newParent; }

  // Método para agregar un hijo con la distancia correspondiente
  void addChild(Node *child, double dist);
  // Método para imprimir información del nodo y sus hijos
  void printChildren(std::ofstream &output_file) const;
};

#endif // __NODE_H__