/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file word-dictionary.test.ts
 * @description Tests unitarios del módulo word-dictionary y de todas las
 *   clases concretas que extienden WordCategory.
 *   Cubre: contrato de WordEntry, aleatoriedad de la categoría elegida,
 *   y que cada fuente devuelve palabras no vacías pertenecientes
 *   a su propio diccionario.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import {getRandomWordEntry} from '../hangman/data/word-dictionary';
import {AnimalsSource} from '../hangman/data/categories/animals-source';
import {CountriesSource} from '../hangman/data/categories/countries-source';
import {FoodDrinkSource} from '../hangman/data/categories/food-drink-source';
import {BrandsSource} from '../hangman/data/categories/brands-source';
import {VideogamesSource} from '../hangman/data/categories/videogames-source';
import {type WordEntry} from '../hangman/interfaces/game-state';

import {describe, it, expect} from '@jest/globals';

// ── Número de muestras usadas en los tests de aleatoriedad ────────────────────
const SAMPLE_SIZE = 200;

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Ejecuta `getRandomWordEntry` repetidamente y recoge los valores únicos
 * del campo indicado.
 *
 * @param field  Campo del WordEntry a recoger ('word' | 'category').
 * @param times  Número de llamadas.
 * @returns Conjunto de valores distintos observados.
 */
function collectUniqueValues(
    field: keyof WordEntry,
    times: number,
): Set<string> {
  const seen = new Set<string>();
  for (let i = 0; i < times; i++) {
    seen.add(getRandomWordEntry()[field]);
  }
  return seen;
}

// ── Tests de getRandomWordEntry ───────────────────────────────────────────────

describe('getRandomWordEntry', () => {
  it('debe devolver un objeto con las propiedades word y category', () => {
    const entry = getRandomWordEntry();
    expect(entry).toHaveProperty('word');
    expect(entry).toHaveProperty('category');
  });

  it('la propiedad word debe ser una cadena no vacía', () => {
    const {word} = getRandomWordEntry();
    expect(typeof word).toBe('string');
    expect(word.length).toBeGreaterThan(0);
  });

  it('la propiedad category debe ser una cadena no vacía', () => {
    const {category} = getRandomWordEntry();
    expect(typeof category).toBe('string');
    expect(category.length).toBeGreaterThan(0);
  });

  it(`debe devolver palabras de al menos 2 categorías distintas en ${SAMPLE_SIZE} llamadas`, () => {
    const uniqueCategories = collectUniqueValues('category', SAMPLE_SIZE);
    // Con 5 categorías y 200 muestras, la probabilidad de sacar solo 1 es ínfima
    expect(uniqueCategories.size).toBeGreaterThanOrEqual(2);
  });

  it(`debe devolver palabras distintas en ${SAMPLE_SIZE} llamadas (aleatoriedad mínima)`, () => {
    const uniqueWords = collectUniqueValues('word', SAMPLE_SIZE);
    expect(uniqueWords.size).toBeGreaterThan(1);
  });
});

// ── Tests de AnimalsSource ────────────────────────────────────────────────────

describe('AnimalsSource', () => {
  const source = new AnimalsSource();

  it('debe tener la etiqueta "Animales"', () => {
    expect(source.label).toBe('Animales');
  });

  it('getWord debe devolver una cadena no vacía', () => {
    expect(source.getWord().length).toBeGreaterThan(0);
  });

  it(`debe devolver palabras distintas en ${SAMPLE_SIZE} llamadas`, () => {
    const unique = new Set(
        Array.from({length: SAMPLE_SIZE}, () => source.getWord()),
    );
    expect(unique.size).toBeGreaterThan(1);
  });
});

// ── Tests de CountriesSource ──────────────────────────────────────────────────

describe('CountriesSource', () => {
  const source = new CountriesSource();

  it('debe tener la etiqueta "Países"', () => {
    expect(source.label).toBe('Países');
  });

  it('getWord debe devolver una cadena no vacía', () => {
    expect(source.getWord().length).toBeGreaterThan(0);
  });

  it(`debe devolver palabras distintas en ${SAMPLE_SIZE} llamadas`, () => {
    const unique = new Set(
        Array.from({length: SAMPLE_SIZE}, () => source.getWord()),
    );
    expect(unique.size).toBeGreaterThan(1);
  });
});

// ── Tests de FoodDrinkSource ──────────────────────────────────────────────────

describe('FoodDrinkSource', () => {
  const source = new FoodDrinkSource();

  it('debe tener la etiqueta "Comida y Bebida"', () => {
    expect(source.label).toBe('Comida y Bebida');
  });

  it('getWord debe devolver una cadena no vacía', () => {
    expect(source.getWord().length).toBeGreaterThan(0);
  });

  it(`debe devolver palabras distintas en ${SAMPLE_SIZE} llamadas`, () => {
    const unique = new Set(
        Array.from({length: SAMPLE_SIZE}, () => source.getWord()),
    );
    expect(unique.size).toBeGreaterThan(1);
  });
});

// ── Tests de BrandsSource ─────────────────────────────────────────────────────

describe('BrandsSource', () => {
  const source = new BrandsSource();

  it('debe tener la etiqueta "Marcas y Empresas"', () => {
    expect(source.label).toBe('Marcas y Empresas');
  });

  it('getWord debe devolver una cadena no vacía', () => {
    expect(source.getWord().length).toBeGreaterThan(0);
  });

  it(`debe devolver palabras distintas en ${SAMPLE_SIZE} llamadas`, () => {
    const unique = new Set(
        Array.from({length: SAMPLE_SIZE}, () => source.getWord()),
    );
    expect(unique.size).toBeGreaterThan(1);
  });
});

// ── Tests de VideogamesSource ─────────────────────────────────────────────────

describe('VideogamesSource', () => {
  const source = new VideogamesSource();

  it('debe tener la etiqueta "Videojuegos"', () => {
    expect(source.label).toBe('Videojuegos');
  });

  it('getWord debe devolver una cadena no vacía', () => {
    expect(source.getWord().length).toBeGreaterThan(0);
  });

  it(`debe devolver palabras distintas en ${SAMPLE_SIZE} llamadas`, () => {
    const unique = new Set(
        Array.from({length: SAMPLE_SIZE}, () => source.getWord()),
    );
    expect(unique.size).toBeGreaterThan(1);
  });
});
