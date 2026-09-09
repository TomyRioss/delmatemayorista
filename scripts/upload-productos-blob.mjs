// Sube public/productos/* a Vercel Blob público y genera backup/blob-mapa.json
// Uso: $env:BLOB_READ_WRITE_TOKEN="..."; node scripts/upload-productos-blob.mjs
import { put } from '@vercel/blob';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const SRC = join(ROOT, 'public', 'productos');
const OUT = join(ROOT, 'backup', 'blob-mapa.json');

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_STORE_ID) {
  console.error('Falta BLOB_READ_WRITE_TOKEN o BLOB_STORE_ID (OIDC)');
  process.exit(1);
}

const files = await walk(SRC);
console.log(`archivos: ${files.length}`);
const mapa = {};
for (const f of files) {
  const rel = relative(join(ROOT, 'public'), f).replace(/\\/g, '/'); // productos/slug/images/0.png
  const body = await readFile(f);
  const blob = await put(`productos/${rel.replace(/^productos\//, '')}`, body, {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  mapa['/' + rel] = blob.url;
  console.log(`ok ${rel}`);
}
await writeFile(OUT, JSON.stringify(mapa, null, 2), 'utf8');
console.log(`mapa: ${OUT}`);
