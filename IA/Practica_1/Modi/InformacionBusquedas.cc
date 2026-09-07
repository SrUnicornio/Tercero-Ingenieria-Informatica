#include "InformacionBusquedas.h"

// Implementación modularizada
void ImprimirNodosGenerados(const std::vector<Node *> &nodos_generados, std::ofstream &output_file)
{
  output_file << "Generated nodes: ";
  if (nodos_generados.empty())
  {
    output_file << "-";
  }
  else
  {
    for (size_t i = 0; i < nodos_generados.size(); ++i)
    {
      output_file << nodos_generados[i]->getValue();
      if (i < nodos_generados.size() - 1)
        output_file << ", ";
    }
  }
  output_file << std::endl;
}

void ImprimirNodosInspeccionados(const std::vector<Node *> &nodos_inspeccionados, std::ofstream &output_file)
{
  output_file << "Inspected nodes: ";
  if (nodos_inspeccionados.empty())
  {
    output_file << "-";
  }
  else
  {
    for (size_t i = 0; i < nodos_inspeccionados.size(); ++i)
    {
      output_file << nodos_inspeccionados[i]->getValue();
      if (i < nodos_inspeccionados.size() - 1)
        output_file << ", ";
    }
  }
  output_file << std::endl;
}

void ImprimirSeparador(std::ofstream &output_file)
{
  output_file << std::string(200, '_') << std::endl;
}

void ImprimirCaminoInfo(const std::vector<Node *> &camino, std::ofstream &output_file)
{
  output_file << "Path: ";
  double coste = 0.0;
  for (size_t i = 0; i < camino.size(); ++i)
  {
    output_file << camino[i]->getValue();
    if (i < camino.size() - 1)
    {
      output_file << " -> ";
      // si nodo es el mismo, coste = 0
      if (camino[i] != camino[i + 1])
      {
        coste += camino[i]->getDistanceToChild(camino[i + 1]);
      }
    }
  }
  output_file << std::endl;
  output_file << "Coste del camino: " << coste << std::endl;
}