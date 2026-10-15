/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Asignatura: Programación de Aplicaciones Interactivas
 * 
 * @description Grade School
 *   Implementa la clase GradeSchool que representa un sistema de gestión de estudiantes en una escuela primaria. La clase debe permitir agregar estudiantes a diferentes grados y obtener una lista de estudiantes por grado, así como una lista completa de todos los estudiantes ordenados alfabéticamente por grado.
 * 
 * @author Alvaro Pérez Ramos   -   alu0101574042@ull.edu.es
 * @since 24 FEB 2026
 * @see {@link https://exercism.org/tracks/typescript/exercises/grade-school}
 */

type Roster = {
  [grade: number]: string[]
}

export class GradeSchool {
  private readonly students: Roster = {}

  /**
   * Devuelve un objeto que representa el roster completo de estudiantes, donde las claves son los grados y los valores son listas de nombres de estudiantes ordenados alfabéticamente.
   * 
   * @returns Un objeto que representa el roster completo de estudiantes, donde las claves son los grados y los valores son listas de nombres de estudiantes ordenados alfabéticamente.
   */
  roster(): Roster {
    const result: Roster = {};

    for (const grade in this.students) {
      result[grade] = [...this.students[grade]].sort();
    }

    return result;
  }

  /**
   * Agrega un estudiante a un grado específico. Si el grado no existe, se crea una nueva entrada en el roster. Si el grado ya existe, el estudiante se agrega a la lista de ese grado y se ordena alfabéticamente.
   * 
   * @param name - El nombre del estudiante
   * @param grade - El grado al que pertenece el estudiante
   */
  add(name: string, grade: number): void {
    this.removeStudentFromAllGrades(name);

    if (!this.students[grade]) {
     this.students[grade] = [];
    }

    this.students[grade].push(name);
    this.students[grade].sort();
  }

  /**
   * Devuelve una lista de estudiantes que pertenecen a un grado específico. Si el grado no existe, devuelve una lista vacía.
   * 
   * @param grade - El grado del que se desea obtener la lista de estudiantes
   * @returns Una lista de estudiantes que pertenecen al grado especificado, ordenada alfabéticamente. Si el grado no existe, devuelve una lista vacía.
   */
  grade(grade: number) {
    return this.students[grade]
      ? [...this.students[grade]]
      : [];
  }

  /**
   * Elimina un estudiante de todos los grados en el roster. Si el estudiante no se encuentra en ningún grado, no se realiza ninguna acción.
   * 
   * @param name - El nombre del estudiante a eliminar
   */
  private removeStudentFromAllGrades(name: string): void {
    for (const grade in this.students) {
      this.students[grade] =
        this.students[grade].filter(
          (student) => student !== name,
        );
    }
  }
}
