import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local', // Cambiar esto a 'github' para produccion y configurar la authenticacion para el admin
    // Ademas agregar esto para produccion
    // repo: {
    // owner: 'TomyRioss',
    // name: 'delmatemayorista',
    // }
  },
  singletons: {
    bannerPersonalizado: singleton({
      label: 'Banner - Personaliza tus productos',
      path: 'content/banner-personalizado',
      format: { data: 'json' },
      schema: {
        imagenDesktop: fields.image({
          label: 'Imagen (desktop)',
          description: 'Resolución recomendada: 1200x160px',
          directory: 'public/banner-personalizado',
          publicPath: '/banner-personalizado/',
        }),
        imagenMobile: fields.image({
          label: 'Imagen (celular)',
          description: 'Resolución recomendada: 800x400px',
          directory: 'public/banner-personalizado',
          publicPath: '/banner-personalizado/',
        }),
      },
    }),
  },
  collections: {
    bannerHero: collection({
      label: 'Flyer principal',
      slugField: 'nombre',
      path: 'content/banner-hero/*',
      format: { data: 'json' },
      schema: {
        nombre: fields.slug({ name: { label: 'Nombre interno (ej: slide-1)' } }),
        imagenDesktop: fields.image({
          label: 'Imagen (desktop)',
          description: 'Resolución recomendada: 1500x400px',
          directory: 'public/banner-hero',
          publicPath: '/banner-hero/',
        }),
        imagenMobile: fields.image({
          label: 'Imagen (celular)',
          description: 'Resolución recomendada: 800x600px',
          directory: 'public/banner-hero',
          publicPath: '/banner-hero/',
        }),
        link: fields.text({
          label: 'Link (opcional)',
          description: 'A donde redirige al hacer click. Interno (ej: /tienda) o externo (ej: https://...)',
        }),
      },
    }),
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
    productos: collection({
      label: 'Productos',
      slugField: 'name',
      path: 'content/productos/*',
      format: { data: 'json' },
      schema: {
        name: fields.slug({ name: { label: 'Nombre' } }),
        price: fields.number({ label: 'Precio', validation: { min: 0 } }),
        images: fields.array(
          fields.image({
            label: 'Imagen',
            directory: 'public/productos',
            publicPath: '/productos/',
          }),
          { label: 'Imágenes', itemLabel: () => 'Imagen' }
        ),
        description: fields.text({ label: 'Descripción', multiline: true }),
        category: fields.relationship({ label: 'Categoría', collection: 'categorias' }),
        variantGroup: fields.text({
          label: 'Grupo de variantes',
          description:
            'Opcional. Productos con el mismo valor acá (ej: "mate-imperial-cuero") se muestran como variantes entre sí en la página de producto.',
        }),
        variantLabel: fields.text({
          label: 'Nombre de esta variante',
          description: 'Opcional. Ej: "Rojo", "Blanco", "Negro". Se muestra como opción para elegir.',
        }),
        minPurchase: fields.conditional(
          fields.select({
            label: 'Compra mínima',
            options: [
              { label: 'Paquetes (unidades)', value: 'packs' },
              { label: 'Precio', value: 'price' },
            ],
            defaultValue: 'packs',
          }),
          {
            packs: fields.number({
              label: 'Cantidad mínima de unidades',
              validation: { min: 1 },
              defaultValue: 1,
            }),
            price: fields.number({ label: 'Precio mínimo', validation: { min: 0 } }),
          }
        ),
      },
    }),
    pedidos: collection({
      label: 'Pedidos',
      slugField: 'codigo',
      path: 'content/pedidos/*',
      format: { data: 'json' },
      schema: {
        codigo: fields.slug({ name: { label: 'Código' } }),
        fecha: fields.date({ label: 'Fecha' }),
        nombre: fields.text({ label: 'Nombre' }),
        apellido: fields.text({ label: 'Apellido' }),
        email: fields.text({ label: 'Email' }),
        telefono: fields.text({ label: 'Teléfono' }),
        items: fields.array(
          fields.object({
            producto: fields.text({ label: 'Producto' }),
            cantidad: fields.number({ label: 'Cantidad' }),
            precioUnitario: fields.number({ label: 'Precio unitario' }),
          }),
          { label: 'Items', itemLabel: (props) => props.fields.producto.value || 'Item' }
        ),
        total: fields.number({ label: 'Total' }),
      },
    }),
  },
});