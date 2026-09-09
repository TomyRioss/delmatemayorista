// Service Worker del admin: redirige api.github.com al proxy same-origin.
// Keystatic (browser) -> /api/gh-proxy (Vercel, EEUU) -> api.github.com.
// Evita el PoP Fastly/EZE que devuelve 503 Backend.max_conn.
const PROXY = '/api/gh-proxy';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
  let url;
  try {
    url = new URL(event.request.url);
  } catch {
    return;
  }
  if (url.origin !== 'https://api.github.com') return;
  event.respondWith(
    (async () => {
      const headers = new Headers();
      for (const [k, v] of event.request.headers) {
        const name = k.toLowerCase();
        if (name === 'authorization' || name === 'accept' || name === 'content-type') {
          headers.set(k, v);
        }
      }
      const init = { method: event.request.method, headers };
      if (event.request.method !== 'GET' && event.request.method !== 'HEAD') {
        init.body = await event.request.arrayBuffer();
      }
      return fetch(PROXY + url.pathname + url.search, init);
    })()
  );
});
