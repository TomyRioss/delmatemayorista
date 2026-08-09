import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local', // Cambiar esto a 'github' para produccion y configurar la authenticacion para el admin
    // Ademas agregar esto para produccion
    // repo: {
    // owner: 'TomyRioss',
    // name: 'delmatemayorista',
    // }
  },
  collections: {
    categorias: collection({
      label: 'Categorías',
      slugField: 'label',
      path: 'content/categorias/*',
      format: { data: 'json' },
      schema: {
        label: fields.slug({ name: { label: 'Nombre' } }), // esto genera el slug automático (ej: "Mates" -> mates)
        image: fields.image({
          label: 'Imagen',
          directory: 'public/categorias',
          publicPath: '/categorias/',
        }),
      },
    }),
  },
});