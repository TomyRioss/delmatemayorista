// Restaura public/ desde Blob usando backup/blob-mapa*.json (URL -> ruta local).
// Uso: node scripts/download-blob.mjs
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const ROOT = process.cwd();
import mapa1 from '../backup/blob-mapa.json' with { type: 'json' };
import mapa2 from '../backup/blob-mapa-resto.json' with { type: 'json' };

const mapa = { ...mapa1, ...mapa2 };
const entradas = Object.entries(mapa);
console.log(`entradas: ${entradas.length}`);
let ok = 0;
for (const [local, url] of entradas) {
  const rel = local.startsWith('/') ? local.slice(1) : local;
  const out = join(ROOT, 'public', rel);
  const r = await fetch(url);
  if (!r.ok) {
    console.log(`FALLA ${r.status} ${local}`);
    continue;
  }
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, Buffer.from(await r.arrayBuffer()));
  ok++;
  if (ok % 30 === 0) console.log(`...${ok}`);
}
console.log(`ok: ${ok}/${entradas.length}`);
