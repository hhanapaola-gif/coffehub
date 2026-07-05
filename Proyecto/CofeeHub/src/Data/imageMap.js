// como el backend no guarda imagenes, usamos las que ya traiamos locales
// buscando por nombre de producto
import { PRODUCTS, PROMOTIONS } from './data';

const mapaProductos = {};
PRODUCTS.forEach((p) => {
  mapaProductos[p.name.toLowerCase()] = p.img;
});

export function getProductImage(nombre) {
  if (!nombre) return PRODUCTS[0].img;
  return mapaProductos[nombre.toLowerCase()] || PRODUCTS[0].img;
}

export function getPromoImage(indice) {
  return PROMOTIONS[indice % PROMOTIONS.length].img;
}
