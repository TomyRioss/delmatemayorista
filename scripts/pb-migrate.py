# Migracion Keystatic -> PocketBase para delmatemayorista.
#
# Haceuridad TODO el flujo en un paso:
#   1. Hospital crea collections (productos, categorias, banner_hero,
#      banners_simples, ventanas_laterales) con campos FILE, no JSON-texto.
#   2. Importa registros desde content/ subiendo los archivos desde public/
#      via multipart/form-data.
#
# Uso (desde la raiz del repo):
#   PB_URL=http://127.0.0.1:8096 \
#   PB_ADMIN=test-admin@delmate.local \
#   PB_PASS='T3mporal!2026' \
#   python scripts/pb-migrate.py
#
# Flags:
#   --drop   : borra las collections si ya existen antes de recrearlas
#   --dry-run: solo muestra lo que se haria, no toca nada
import json, glob, os, sys, time, mimetypes, urllib.request, urllib.error
import uuid, collections

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PB_URL = os.environ.get('PB_URL', 'http://127.0.0.1:8096').rstrip('/')
PB_ADMIN = os.environ.get('PB_ADMIN', 'admin@delmatemayorista.com')
PB_PASS = os.environ.get('PB_PASS', 'DelMateMayorista123@')

# python PB_ROUTE
SLUG_STYLE = {'MATES': 'mates', 'COMBOS MATEROS': 'combos-materos',
              'BOLSOS MATEROS': 'bolsos-materos', 'YERBERAS Y AZUCARERAS': 'yerberas-y-azucareras'}
DROP = '--drop' in sys.argv
DRY_RUN = '--dry-run' in sys.argv


def req(method, path, token=None, body=None, multipart=None, timeout=60):
    """multipart: list of ('images', (filename, bytes)) para campos file"""
    url = PB_URL + path
    h = {}
    data = None
    if multipart is not None:
        boundary = uuid.uuid4().hex
        parts = []
        for name, (fname, blob) in multipart:
            parts.append(f'--{boundary}\r\nContent-Disposition: form-data; name="{name}"; filename="{fname}"\r\nContent-Type: {mimetypes.guess_type(fname)[0] or "application/octet-stream"}\r\n\r\n'.encode('utf-8'))
            parts.append(blob)
            parts.append(b'\r\n')
        for k, v in (body or {}).items():
            parts.append(f'--{boundary}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode('utf-8'))
        parts.append(f'--{boundary}--\r\n'.encode('utf-8'))
        data = b''.join(parts)
        h['Content-Type'] = f'multipart/form-data; boundary={boundary}'
    elif body is not None:
        data = json.dumps(body).encode('utf-8')
        h['Content-Type'] = 'application/json'
    if token:
        h['Authorization'] = token
    r = urllib.request.Request(url, data=data, method=method, headers=h)
    try:
        with urllib.request.urlopen(r, timeout=timeout) as resp:
            t = resp.read().decode('utf-8')
            return resp.status, json.loads(t) if t.strip() else {}
    except urllib.error.HTTPError as e:
        try:
            return e.code, json.loads(e.read().decode('utf-8') or '{}')
        except Exception:
            return e.code, {}
    except Exception as e:
        return 0, {'error': str(e)}


def import_json(p):
    with open(p, encoding='utf-8') as fh:
        return json.load(fh)


def media_file(pub_path):
    """'/productos/slug/images/0.jpg' -> bytes del archivo en public/"""
    if not pub_path:
        return None
    f = os.path.join(BASE, 'public', pub_path.lstrip('/').replace('/', os.sep))
    if not os.path.isfile(f):
        return None
    with open(f, 'rb') as fh:
        return os.path.basename(f), fh.read()


# ---------- DEFINICION DE SCHEMAS ----------
def schema_for(cat_id=None):
    return {
        'categorias': {
            'name': 'categorias', 'type': 'base',
            'fields': [
                {'type': 'text', 'name': 'slug', 'required': True},
                {'type': 'text', 'name': 'label', 'required': True},
                {'type': 'file', 'name': 'image', 'maxSelect': 1, 'maxSize': 5242880,
                 'mimeTypes': ['image/jpeg', 'image/png', 'image/webp', 'image/gif']},
                {'type': 'file', 'name': 'imagen_mobile', 'maxSelect': 1, 'maxSize': 5242880,
                 'mimeTypes': ['image/jpeg', 'image/png', 'image/webp', 'image/gif']},
            ],
        },
        'productos': {
            'name': 'productos', 'type': 'base',
            'fields': [
                {'type': 'text', 'name': 'slug', 'required': True},
                {'type': 'text', 'name': 'name', 'required': True},
                {'type': 'number', 'name': 'price'},
                {'type': 'file', 'name': 'images', 'maxSelect': 10, 'maxSize': 10485760,
                 'mimeTypes': ['image/jpeg', 'image/png', 'image/webp', 'image/gif']},
                {'type': 'text', 'name': 'description'},
                {'type': 'relation', 'name': 'categoria', 'collectionId': cat_id, 'maxSelect': 1},
                {'type': 'json', 'name': 'variantes'},
                {'type': 'bool', 'name': 'oferta'},
                {'type': 'bool', 'name': 'novedad'},
                {'type': 'bool', 'name': 'pausado'},
                {'type': 'number', 'name': 'min_packs'},
                {'type': 'number', 'name': 'min_price'},
            ],
        },
        'banner_hero': {
            'name': 'banner_hero', 'type': 'base',
            'fields': [
                {'type': 'text', 'name': 'nombre', 'required': True},
                {'type': 'file', 'name': 'imagen_desktop', 'maxSelect': 1, 'maxSize': 5242880,
                 'mimeTypes': ['image/jpeg', 'image/png', 'image/webp', 'image/gif']},
                {'type': 'file', 'name': 'imagen_mobile', 'maxSelect': 1, 'maxSize': 5242880,
                 'mimeTypes': ['image/jpeg', 'image/png', 'image/webp', 'image/gif']},
                {'type': 'text', 'name': 'link'},
                {'type': 'number', 'name': 'orden'},
            ],
        },
        'banners_simples': {
            'name': 'banners_simples', 'type': 'base',
            'fields': [
                {'type': 'text', 'name': 'key', 'required': True},
                {'type': 'file', 'name': 'imagen_desktop', 'maxSelect': 1, 'maxSize': 5242880,
                 'mimeTypes': ['image/jpeg', 'image/png', 'image/webp', 'image/gif']},
                {'type': 'file', 'name': 'imagen_mobile', 'maxSelect': 1, 'maxSize': 5242880,
                 'mimeTypes': ['image/jpeg', 'image/png', 'image/webp', 'image/gif']},
                {'type': 'text', 'name': 'link'},
            ],
        },
        'ventanas_laterales': {
            'name': 'ventanas_laterales', 'type': 'base',
            'fields': [
                {'type': 'text', 'name': 'key', 'required': True},
                {'type': 'text', 'name': 'tipo', 'required': True},
                {'type': 'file', 'name': 'archivo', 'maxSelect': 1, 'maxSize': 10485760,
                 'mimeTypes': ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']},
                {'type': 'text', 'name': 'link'},
            ],
        },
    }


def main():
    code, r = req('POST', '/api/collections/_superusers/auth-with-password',
                  body={'identity': PB_ADMIN, 'password': PB_PASS})
    if code != 200:
        print('FATAL auth:', code, r)
        sys.exit(1)
    TOKEN = r['token']
    print('Auth OK')

    # ------- dry-run: mostrar conteos
    cats = [(os.path.basename(f)[:-5], import_json(f))
            for f in sorted(glob.glob(os.path.join(BASE, 'content', 'categorias', '*.json')))]
    prods = []
    for f in sorted(glob.glob(os.path.join(BASE, 'content', 'productos', '*.json'))):
        p = import_json(f)
        p['_slug'] = os.path.basename(f)[:-5]
        prods.append(p)
    heroes = [import_json(f) for f in glob.glob(os.path.join(BASE, 'content', 'banner-hero', '*.json'))]
    v = import_json(os.path.join(BASE, 'content', 'ventanas-laterales.json'))

    files_total = sum(len(p.get('images', [])) for p in prods)
    files_total += len(cats) * 2
    files_total += len(heroes) * 2
    files_total += 2  # banners simples
    files_total += 2  # ventanas

    print(f'DRY-RUN/plan: {len(cats)} categorias, {len(prods)} productos, {len(heroes)} banners hero,'
          f' 2 banners simples, {len(v)} ventanas. Archivos a subir: {files_total}')
    if DRY_RUN:
        return

    # ------- crear collections
    existing = {}
    code, r = req('GET', '/api/collections?perPage=100', TOKEN)
    if code == 200:
        for c in r.get('items', []):
            existing[c['name']] = c['id']
    if DROP:
        for name in ['productos', 'banner_hero', 'banners_simples', 'ventanas_laterales', 'categorias']:
            if name in existing:
                code, r = req('DELETE', f'/api/collections/{existing[name]}', TOKEN)
                print(f'drop {name}: {code}')
        existing = {}
        code, r = req('GET', '/api/collections', TOKEN)
        for c in r.get('collections', []):
            existing[c['name']] = c['id']

    schemas = schema_for()
    ids = {}
    # 1. categorias primero (para obtener collectionId para la relacion)
    for name in ['categorias', 'productos', 'banner_hero', 'banners_simples', 'ventanas_laterales']:
        if name in existing:
            ids[name] = existing[name]
            print(f'  {name}: ya existe')
            continue
        body = schemas[name]
        if name == 'productos' and 'categorias' in ids:
            for fld in body['fields']:
                if fld['name'] == 'categoria' and 'relation' in fld.get('type', ''):
                    fld['collectionId'] = ids['categorias']
        code, r = req('POST', '/api/collections', TOKEN, body)
        if code == 200:
            ids[name] = r['id']
            print(f'  {name}: creada')
        else:
            print(f'  FATAL creando {name}: {code} {r}')
            sys.exit(1)

    # ------- categorias
    cat_id_by_slug = {}
    for fname, d in cats:
        slug = SLUG_STYLE.get(fname, fname)
        mp = []
        img = media_file(d.get('image'))
        if img:
            mp.append(('image', img))
        mob = media_file(d.get('imagenMobile'))
        if mob:
            mp.append(('imagen_mobile', mob))
        body = {'slug': slug, 'label': d['label']}
        code, r = req('POST', '/api/collections/categorias/records', TOKEN, body=body, multipart=mp)
        if code == 200:
            cat_id_by_slug[slug] = r['id']
        else:
            print(f'  ERROR cat {slug}: {code} {r}')
    print(f'  categorias: {len(cat_id_by_slug)} / {len(cats)}')

    # ------- productos
    # --resume: salta los que ya existen (match por slug)
    ya_hechos = set()
    if '--resume' in sys.argv:
        page = 1
        while True:
            code, r = req('GET', f'/api/collections/productos/records?perPage=200&page={page}',
                          TOKEN)
            if code != 200:
                break
            for it in r.get('items', []):
                ya_hechos.add(it['slug'])
            if page >= r.get('totalPages', 1):
                break
            page += 1
        print(f'RESUME: {len(ya_hechos)} productos ya importados, se saltean')

    ok = err = skip = 0
    for p in prods:
        if p['_slug'] in ya_hechos:
            skip += 1
            continue
        cat_used = p.get('category')
        cat_slug = SLUG_STYLE.get(cat_used, cat_used)
        mp = []
        for img_path in p.get('images', []):
            f = media_file(img_path)
            if f:
                mp.append(('images', f))
        body = {
            'slug': p['_slug'],
            'name': p['name'],
            'price': str(p.get('price') or '') or '0',
            'description': p.get('description') or '',
            'variantes': json.dumps(p.get('variantes', [])),
            'oferta': 'true' if p.get('oferta') else 'false',
            'novedad': 'true' if p.get('novedad') else 'false',
            'pausado': 'true' if p.get('pausado') else 'false',
        }
        if cat_slug:
            body['categoria'] = cat_id_by_slug.get(cat_slug, '')
        m = p.get('minPurchase')
        if m and m.get('discriminant') == 'packs':
            body['min_packs'] = str(m.get('value') or 1)
        elif m and m.get('discriminant') == 'price':
            body['min_price'] = str(m.get('value') or 0)
        code, r = req('POST', '/api/collections/productos/records', TOKEN, body=body, multipart=mp, timeout=180)
        if code == 200:
            ok += 1
        else:
            err += 1
            print(f'  ERROR prod {p["_slug"]}: {code} {r}')
        if ok and ok % 25 == 0:
            print(f'  ... {ok}/{len(prods)} productos')
    print(f'  productos: {ok} ok / {err} error / {skip} ya existian (resume)')

    # ------- banner hero
    hero_ok = 0
    for f in sorted(glob.glob(os.path.join(BASE, 'content', 'banner-hero', '*.json'))):
        d = import_json(f)
        mp = []
        img = media_file(d.get('imagenDesktop'))
        if img:
            mp.append(('imagen_desktop', img))
        mob = media_file(d.get('imagenMobile'))
        if mob:
            mp.append(('imagen_mobile', mob))
        orden = 0
        if d['nombre'].split('-')[-1].isdigit():
            orden = int(d['nombre'].split('-')[-1])
        body = {'nombre': d['nombre'], 'link': d.get('link') or '', 'orden': str(orden)}
        code, r = req('POST', '/api/collections/banner_hero/records', TOKEN, body=body, multipart=mp)
        hero_ok += 1 if code == 200 else 0
        if code != 200:
            print(f'  ERROR hero {d.get("nombre")}: {code} {r}')
    print(f'  banner hero: {hero_ok}/{len(heroes)}')

    # ------- banners simples
    for key, fname in [('como_comprar', 'banner-como-comprar.json'),
                       ('personalizado', 'banner-personalizado.json')]:
        d = import_json(os.path.join(BASE, 'content', fname))
        mp = []
        img = media_file(d.get('imagenDesktop'))
        if img:
            mp.append(('imagen_desktop', img))
        mob = media_file(d.get('imagenMobile'))
        if mob:
            mp.append(('imagen_mobile', mob))
        body = {'key': key, 'link': d.get('link') or ''}
        code, r = req('POST', '/api/collections/banners_simples/records', TOKEN, body=body, multipart=mp)
        if code != 200:
            print(f'  ERROR banner {key}: {code} {r}')
    print('  banners simples: 2/2')

    # ------- ventanas
    v_ok = 0
    for key, w in [('izquierda', v.get('ventanaIzquierda')), ('derecha', v.get('ventanaDerecha'))]:
        if not w:
            continue
        a = w['archivo']
        mp = []
        f = media_file(a.get('value'))
        if f:
            mp.append(('archivo', f))
        body = {'key': key, 'tipo': a['discriminant'], 'link': w.get('link') or ''}
        code, r = req('POST', '/api/collections/ventanas_laterales/records', TOKEN, body=body, multipart=mp)
        v_ok += 1 if code == 200 else 0
        if code != 200:
            print(f'  ERROR ventana {key}: {code} {r}')
    print(f'  ventanas: {v_ok}')

    # ------- conteo final
    for col in ['categorias', 'productos', 'banner_hero', 'banners_simples', 'ventanas_laterales']:
        code, r = req('GET', f'/api/collections/{col}/records?perPage=1', TOKEN)
        total = r.get('totalItems', '?') if code == 200 else f'(err {code})'
        print(f'  VERIFICACION {col}: {total} registros')


if __name__ == '__main__':
    main()
