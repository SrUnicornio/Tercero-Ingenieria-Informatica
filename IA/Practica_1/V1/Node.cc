#include "Node.h"

/**
 * @brief Establece relación padre-hijo entre nodos.
 * @param child 
 */
void Node::addChild(Node *child, double dist)
{
  children.push_back(std::make_pair(child, dist)); // Almacena el hijo y su distancia
  child->setParent(this);                          // Establece este nodo como padre del hijo
}
/**
 * @brief Imprime los hijos de un nodo.
 * @param output_file Archivo de salida.
 */
void Node::printChildren(std::ofstream &output_file) const
{
  for (const auto &pair : children)
  {
    output_file << pair.first->getValue();
    if (pair.first->getValue() != children.back().first->getValue())
    {
      output_file << ", ";
    }
  }
  output_file << std::endl;
}

/**
 * @brief Obtiene la distancia a un hijo.
 * @param child Nodo hijo.
 * @return Distancia al hijo.
 */
double Node::getDistanceToChild(Node *child) const
{
  for (const auto &pair : children)
  {
    if (pair.first == child)
    {
      return pair.second; // Retorna la distancia al hijo
    }
  }
  return -1; // Retorna -1 si el hijo no se encuentra
}
