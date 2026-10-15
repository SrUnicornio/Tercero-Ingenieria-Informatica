/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Asignatura: Programación de Aplicaciones Interactivas
 * 
 * @description This program defines the PhoneNumberClient class, which represents a client with a name and a phone number. 
 * The class includes methods to get the client's name and phone number, as well as a method to display the client's information.
 * 
 * En países como Estados Unidos, es habitual que los anunciantes faciliten su número de teléfono utilizando letras en lugar de números. 
 * Por ejemplo, un pintor puede decir que su «número» es 1-800-PAINTER. 
 * Gracias a marcadores como el de la figura, cuando una persona utiliza este «número», en realidad marca 1-800-7246837.
 * 
 * Escriba un programa orientado a objetos que lea un «número» de teléfono que incluya letras y lo convierta en el número equivalente que solo contenga números. La entrada es un «número» de teléfono que puede incluir letras mayúsculas, guiones y dígitos.
El programa imprimirá como salida el número de teléfono equivalente, conservando los guiones.

Input				     Output
1-800-PAINTER			1-800-7246837
WAA-D1T1PV 			922-318178

1.a) Desarrolle usando Jest tests correspondientes a los dos tests públicos anteriores.
Utilice esta página para generar una “palabra” que corresponda con su número de teléfono y añada tests adicionales que comprueben que su programa convierte su número de teléfono en la palabra obtenida.
1.b) Desarrolle un programa TS orientado a objetos que solucione el problema y compruebe que pasa los test anteriores.

 * @author Alvaro Pérez Ramos   -   alu0101574042@ull.edu.es
 * @since 24 FEB 2026
 */

/**
 * Class representing a client with a name and a phone number.
 */
