# Deduplica categorias en PocketBase: por slug conserva el id con mas
# productos apuntando, re-apunta los productos de la duplicada y borra la dup.
import json, urllib.request, urllib.error, collections

PB_URL = 'http://127.0.0.1:8096'


def req(method, path, token=None, body=None):
    data = None if body is None else json.dumps(body).encode('utf-8')
    h = {'Content-Type': 'application/json'} if body else {}
    if token:
        h['Authorization'] = token
    r = urllib.request.Request(PB_URL + path, data=data, method=method, headers=h)
    try:
        with urllib.request.urlopen(r, timeout=60) as resp:
            t = resp.read().decode('utf-8')
            return resp.status, json.loads(t) if t.strip() else {}
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode('utf-8') or '{}')


code, r = req('POST', '/api/collections/_superusers/auth-with-password',
              body={'identity': 'test-admin@delmate.local', 'password': 'T3mporal!2026'})
TOKEN = r['token']

_, cats_r = req('GET', '/api/collections/categorias/records?perPage=200', TOKEN)
cats = cats_r['items']
_, prods_r = req('GET', '/api/collections/productos/records?perPage=500', TOKEN)
prods = prods_r['items']

by_slug = collections.defaultdict(list)
for c in cats:
    by_slug[c['slug']].append(c['id'])
used = collections.Counter(p['categoria'] for p in prods if p.get('categoria'))

keep, kill = {}, {}
for slug, ids in by_slug.items():
    best = max(ids, key=lambda i: used.get(i, 0))
    keep[slug] = best
    kill[slug] = [i for i in ids if i != best]
print('conservando', len(keep), 'slugs; borrando', sum(len(v) for v in kill.values()), 'duplicados')

# re-apuntar productos
fixed = 0
for p in prods:
    cid = p.get('categoria')
    if not cid:
        continue
    slug = next((s for s, ids in by_slug.items() if cid in ids), None)
    if slug and cid != keep[slug]:
        code, r = req('PATCH', f'/api/collections/productos/records/{p["id"]}', TOKEN,
                      {'categoria': keep[slug]})
        if code == 200:
            fixed += 1
        else:
            print('  ERROR patch', p['slug'], code, r)
print('productos re-apuntados:', fixed)

# borrar duplicadas
deleted = 0
for slug, ids in kill.items():
    for i in ids:
        code, r = req('DELETE', f'/api/collections/categorias/records/{i}', TOKEN)
        deleted += 1 if code == 204 else 0
        if code not in (204, 200):
            print('  ERROR del', slug, i, code, r)
print('categorias duplicadas borradas:', deleted)

# verificar
_, cats_r = req('GET', '/api/collections/categorias/records?perPage=200', TOKEN)
print('VERIFICACION categorias restantes:', cats_r['totalItems'])
slugs = [c['slug'] for c in cats_r['items']]
print('sin dups:', len(slugs) == len(set(slugs)))
_, prods_r = req('GET', '/api/collections/productos/records?perPage=1', TOKEN)
print('VERIFICACION productos:', prods_r['totalItems'])
