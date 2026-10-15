/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author F. de Sande
 * @since Mar 23, 2023
 * @description Program that reads JSON data from URL
 *
 *  If you use fetch It produces an error
 *  But when I load the page I Obtain this error:
 *    Access to fetch at  from origin  has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. 
 *    If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
 * 
 * This 0error occurs because of the CORS (Cross-Origin Resource Sharing) policy which is implemented by the server hosting 
 * the resource you are trying to access. This policy restricts cross-origin requests made by web browsers, for security reasons.
 *
 * @see {@link
 * https://stackoverflow.com/questions/43871637/no-access-control-allow-origin-header-is-present-on-the-requested-resource-whe}
 */

interface CanchasDeportivas {
  FieldName: string;
  FieldAliases: object;
  GeometryType: string;
  SpatialReference: object;
  Fields: number[];
}

async function fetchData(): Promise<CanchasDeportivas> {
  const response = await fetch('/data');
  const json = await response.json();
  return json;
}

const main = async function () {
  const data = await fetchData();
  console.log(data);
};

main();
