§G
Mostrar tráfico Vercel Analytics en `/admin/visits`.

§C
- ⊥ Prisma, DB, almacenamiento propio
- Token Vercel solo server-side
- Reutilizar auth admin existente

§I
page: `/admin/visits` → panel visitas
env: `VERCEL_TOKEN`, `VERCEL_PROJECT_ID`, `VERCEL_TEAM_ID`? → Vercel Analytics API

§V
V1: ∀ `/admin/visits` → admin session required
V2: ∀ Vercel requests → token never exposed client-side
V3: missing analytics env → actionable error, no crash

§T
id|status|task|cites
T1|x|add Vercel Analytics server query|V2,V3,I.env
T2|x|add protected visits page with 30-day traffic|V1,V2,V3,I.page
T3|~|verify lint and production build|V1,V2,V3

§B
id|date|cause|fix
B1|2026-09-24|lint fails in pre-existing files|external repo debt
B2|2026-09-24|build requires network for existing Google Fonts|external build environment
B3|2026-09-24|session cookie secure flag followed NODE_ENV on local HTTP|V1
