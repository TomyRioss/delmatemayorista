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
  ui: {
    brand: {
      name: 'DelMate',
      mark: () => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/logo.png"
          alt="DelMate"
          style={{ height: 24, width: 24, objectFit: 'contain' }}
        />
      ),
    },
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

    productos: collection({
      label: 'Productos',
      slugField: 'nombre',
      path: 'content/productos/*',
      format: { data: 'json' },
      entryLayout: 'form',
      schema: {
        nombre: fields.slug({ name: { label: 'Nombre' } }),
        precio: fields.number({
          label: 'Precio',
          description: 'Precio de lista, en pesos, sin puntos ni comas.',
          defaultValue: 0,
        }),
        categoria: fields.relationship({
          label: 'Categoría',
          collection: 'categorias',
        }),
        imagenes: fields.array(
          fields.image({
            label: 'Imagen',
            directory: 'public/productos',
            publicPath: '/productos/',
          }),
          {
            label: 'Imágenes',
            description: 'Podés cargar más de una imagen; se muestran en un carrusel dentro de la card.',
            itemLabel: () => 'Imagen',
          }
        ),
        descripcion: fields.text({
          label: 'Descripción',
          multiline: true,
        }),
        cantidadMinima: fields.number({
          label: 'Cantidad mínima de compra',
          defaultValue: 1,
          validation: { min: 1 },
        }),
        destacado: fields.checkbox({
          label: 'Destacado',
          description: 'Los productos destacados aparecen primero en los listados.',
          defaultValue: false,
        }),
        enOferta: fields.checkbox({
          label: 'En oferta',
          defaultValue: false,
        }),
        precioOferta: fields.number({
          label: 'Precio de oferta',
          description: 'Se usa solo si "En oferta" está activado.',
          defaultValue: 0,
        }),
      },
    }),

    pedidos: collection({
      label: 'Órdenes / Pedidos',
      slugField: 'codigo',
      path: 'content/pedidos/*',
      format: { data: 'json' },
      entryLayout: 'form',
      schema: {
        codigo: fields.slug({ name: { label: 'Código' } }),
        fecha: fields.date({ label: 'Fecha', defaultValue: 'today' }),
        estado: fields.select({
          label: 'Estado',
          options: [
            { label: 'Nuevo', value: 'nuevo' },
            { label: 'En proceso', value: 'en-proceso' },
            { label: 'Enviado', value: 'enviado' },
            { label: 'Completado', value: 'completado' },
            { label: 'Cancelado', value: 'cancelado' },
          ],
          defaultValue: 'nuevo',
        }),
        comprador: fields.object(
          {
            nombre: fields.text({ label: 'Nombre' }),
            apellido: fields.text({ label: 'Apellido' }),
            email: fields.text({ label: 'Email' }),
            telefono: fields.text({ label: 'Teléfono' }),
          },
          { label: 'Datos del comprador' }
        ),
        items: fields.array(
          fields.object({
            nombre: fields.text({ label: 'Producto' }),
            cantidad: fields.number({ label: 'Cantidad', defaultValue: 1 }),
            precio: fields.number({ label: 'Precio unitario', defaultValue: 0 }),
          }),
          {
            label: 'Ítems del pedido',
            itemLabel: (props) => props.fields.nombre.value || 'Ítem',
          }
        ),
        total: fields.number({ label: 'Total', defaultValue: 0 }),
      },
    }),
  },
});
