# Configuración de Keystatic para producción

Este documento explica cómo pasar el panel de administración (`/keystatic`) del modo `local` (solo funciona en tu compu, sin login) al modo `github` (funciona en producción, con login real vía GitHub y permisos por repo).

> **Por qué es necesario:** en modo `local`, cualquiera que entre a `/keystatic` en el sitio deployado podría editar el catálogo, porque no hay ningún login de por medio. En modo `github`, solo pueden entrar las cuentas de GitHub con acceso de escritura al repo `delmatemayorista`.

---

## 1. Cambiar el storage en `keystatic.config.tsx`

```tsx
storage: {
  kind: 'github',
  repo: {
    owner: 'TomyRioss',
    name: 'delmatemayorista',
  },
},
```

---

## 2. Crear el archivo `.env.local`

En la raíz del proyecto, al lado de `package.json`. Este archivo **nunca se commitea** (ya está cubierto por `.env*` en el `.gitignore`).

```bash
touch .env.local
```

Se va completando en los pasos siguientes.

---

## 3. Generar `KEYSTATIC_SECRET`

Esta clave la generás vos, no te la da GitHub — es un valor random que Keystatic usa para firmar las sesiones de login.

```bash
openssl rand -base64 32
```

Copiá el resultado y pegalo en `.env.local`:

```
KEYSTATIC_SECRET=el-valor-que-te-generó-el-comando
```

---

## 4. Levantar el dev server

```bash
npm run dev
```

Andá a `/keystatic`. Como el config ya está en modo `github` pero todavía faltan las otras 3 variables, la propia UI de Keystatic va a detectar que falta configurar la GitHub App y va a mostrar un flujo guiado con un botón **"Create GitHub App"**.

---

## 5. Crear la GitHub App

Al hacer clic en "Create GitHub App", te redirige a GitHub para completar un formulario:

- **App name**: algo único, por ejemplo `delmatemayorista-keystatic` (si GitHub dice que ya existe, agregale un sufijo random).
- **Homepage URL**:
  - **En desarrollo**: `http://localhost:3000`
  - **En producción**: el dominio real del sitio deployado (ej: `https://delmatemayorista-three.vercel.app`) — hay que volver a este paso y actualizarla cuando se hace el deploy definitivo.
- El resto de los campos (callback URLs, permisos, webhooks) los completa Keystatic automáticamente — no tocar nada ahí.

---

## 6. Copiar las variables que devuelve GitHub

Al confirmar, GitHub crea la App y devuelve a Keystatic con tres valores nuevos en pantalla:

```
KEYSTATIC_GITHUB_CLIENT_ID=...
KEYSTATIC_GITHUB_CLIENT_SECRET=...
NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG=...
```

Agregarlos a `.env.local`, que queda completo así:

```
KEYSTATIC_SECRET=el-que-generaste-en-el-paso-3
KEYSTATIC_GITHUB_CLIENT_ID=el-que-te-dio-github
KEYSTATIC_GITHUB_CLIENT_SECRET=el-que-te-dio-github
NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG=el-que-te-dio-github
```

---

## 7. Instalar la App en el repo

Keystatic lo pide en el mismo flujo, con un botón **"Install App"**. Elegir el repo `TomyRioss/delmatemayorista` y confirmar. Esto es lo que le da permiso de lectura/escritura sobre ese repo puntual.

---

## 8. Reiniciar el dev server

```bash
# Ctrl+C para matar el proceso anterior
npm run dev
```

(Necesario para que tome las variables de entorno nuevas.)

Entrar de nuevo a `localhost:3000/keystatic`. Ahora debería pedir loguearse con GitHub antes de mostrar el panel. Loguearse y confirmar que entra bien.

---

## 9. Probar el flujo completo

Editar o crear una categoría y guardar. Si funciona, ir al repo en GitHub y verificar que apareció un commit nuevo con el usuario correspondiente como autor — esa es la prueba de que quedó bien conectado.

---

## Al deployar a producción

- [ ] Repetir el **paso 5**, pero actualizando la **Homepage URL** de la GitHub App al dominio real (ej: `https://delmatemayorista-three.vercel.app`).
- [ ] Cargar las mismas 4 variables de entorno en Vercel:
  `KEYSTATIC_SECRET`, `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`
  → Vercel Dashboard → proyecto → **Settings → Environment Variables**.
- [ ] Confirmar que solo las cuentas de GitHub deseadas tengan acceso de escritura al repo (eso es lo que controla quién puede entrar a `/keystatic` en producción).

---

## Referencia rápida de variables

| Variable | Quién la genera | Dónde se usa |
|---|---|---|
| `KEYSTATIC_SECRET` | Vos (`openssl rand -base64 32`) | `.env.local` (dev) y Vercel (prod) |
| `KEYSTATIC_GITHUB_CLIENT_ID` | GitHub, al crear la App | `.env.local` (dev) y Vercel (prod) |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | GitHub, al crear la App | `.env.local` (dev) y Vercel (prod) |
| `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | GitHub, al crear la App | `.env.local` (dev) y Vercel (prod) |

> Ver también `.env.example` en la raíz del proyecto, que documenta esta misma estructura sin exponer valores reales.