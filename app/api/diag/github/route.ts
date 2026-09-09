// Diagnóstico temporal: ¿llega el backend de Vercel a api.github.com?
// GET /api/diag/github -> { ok, status } del blob de slide-2.json
export async function GET() {
  const sha = 'fa1308331ce4cd842a4dcdcfafab1e35a78e2b78';
  try {
    const r = await fetch(
      `https://api.github.com/repos/TomyRioss/delmatemayorista/git/blobs/${sha}`,
      { headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'delmatemayorista-diag' } }
    );
    const body = await r.text();
    return Response.json({ ok: r.ok, status: r.status, bytes: body.length });
  } catch (e) {
    return Response.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
