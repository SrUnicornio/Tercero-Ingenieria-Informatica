/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file render-config.test.ts
 * @description Tests contractuales de RenderConfig y DEFAULT_RENDER_CONFIG.
 *   Verifican que la constante exportada cumple la forma de la interfaz
 *   y que sus valores por defecto son los esperados. Estos tests actúan
 *   como documentación ejecutable: si alguien cambia los defaults sin
 *   querer, los tests fallan de forma explícita.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import {DEFAULT_RENDER_CONFIG} from '../hangman/interfaces/render-config';
import {describe, it, expect} from '@jest/globals';

describe('DEFAULT_RENDER_CONFIG', () => {
  it('debe tener la propiedad strokeColor de tipo string', () => {
    expect(typeof DEFAULT_RENDER_CONFIG.strokeColor).toBe('string');
  });

  it('debe tener strokeColor igual a "black"', () => {
    expect(DEFAULT_RENDER_CONFIG.strokeColor).toBe('black');
  });

  it('debe tener la propiedad lineWidth de tipo number', () => {
    expect(typeof DEFAULT_RENDER_CONFIG.lineWidth).toBe('number');
  });

  it('debe tener lineWidth igual a 4', () => {
    expect(DEFAULT_RENDER_CONFIG.lineWidth).toBe(4);
  });

  it('debe tener la propiedad padding de tipo number', () => {
    expect(typeof DEFAULT_RENDER_CONFIG.padding).toBe('number');
  });

  it('debe tener padding igual a 20', () => {
    expect(DEFAULT_RENDER_CONFIG.padding).toBe(20);
  });

  it('debe tener exactamente las tres propiedades del contrato RenderConfig', () => {
    const keys = Object.keys(DEFAULT_RENDER_CONFIG).sort();
    expect(keys).toEqual(['lineWidth', 'padding', 'strokeColor']);
  });
});
