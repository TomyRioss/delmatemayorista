// Proxy same-origin hacia api.github.com para el admin Keystatic.
// Solo permite endpoints del repo y /user. Reenvía el Authorization del usuario.
const ALLOW = [/^\/repos\/TomyRioss\/delmatemayorista($|\/)/, /^\/user\/?$/, /^\/graphql$/];

async function handler(req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  const pathname = '/' + (path || []).join('/');
  if (!ALLOW.some((rx) => rx.test(pathname))) {
    return Response.json({ message: 'forbidden' }, { status: 403 });
  }
  const search = new URL(req.url).search;
  const headers = new Headers();
  const auth = req.headers.get('authorization');
  if (auth) headers.set('authorization', auth);
  headers.set('accept', req.headers.get('accept') || 'application/vnd.github+json');
  const ct = req.headers.get('content-type');
  if (ct) headers.set('content-type', ct);
  headers.set('user-agent', 'delmatemayorista-proxy');
  const init: RequestInit = { method: req.method, headers };
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = Buffer.from(await req.arrayBuffer());
  }
  const upstream = await fetch(`https://api.github.com${pathname}${search}`, init);
  const body = await upstream.arrayBuffer();
  return new Response(body, {
    status: upstream.status,
    headers: { 'content-type': upstream.headers.get('content-type') || 'application/json' },
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
