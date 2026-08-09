// Route handler de la API interna de Keystatic.
// La UI del admin (app/keystatic/[[...params]]/page.tsx) llama a estos endpoints
// por atrás cada vez que lees o guardás una entrada (categorías, productos, etc).
// GET  -> leer datos existentes (listar entradas, traer una para editar)
// POST -> escribir datos (crear/editar entrada, subir imagen)
// makeRouteHandler ya trae toda la lógica de lectura/escritura de archivos
// resuelta, solo le pasamos el config para que sepa qué colecciones y
// schemas manejar. Sin este archivo, el admin carga visualmente pero
// "Guardar" no tiene quién lo atienda.
import { makeRouteHandler } from '@keystatic/next/route-handler';
import config from '../../../../keystatic.config';

export const { POST, GET } = makeRouteHandler({ config });