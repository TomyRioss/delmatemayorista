# Variables de entorno para producción

El panel de administración usa PocketBase. Configurá estas variables en Vercel:

```env
POCKETBASE_URL=https://tu-dominio-de-pocketbase
KEYSTATIC_ADMIN_EMAIL=correo-del-superusuario-de-pocketbase
KEYSTATIC_ADMIN_PASSWORD=contraseña-del-superusuario-de-pocketbase
```

Aunque las dos últimas variables conservan el prefijo histórico `KEYSTATIC`, actualmente protegen el acceso al panel y autentican las operaciones administrativas con PocketBase.

`POCKETBASE_URL` debe apuntar al servidor de PocketBase y no debe terminar en `/`. No configures variables `KEYSTATIC_SECRET` ni `KEYSTATIC_GITHUB_*`: el sitio ya no usa Keystatic.

Para mostrar visitas en `/admin/visits`, agregá también `VERCEL_TOKEN` y `VERCEL_PROJECT_ID`. `VERCEL_TEAM_ID` solo es necesario si el proyecto pertenece a un equipo.
