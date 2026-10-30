import json, glob, collections, os, unicodedata

# Mapa: slug filesystem -> label real
slug_label = {}
for f in glob.glob('content/categorias/*.json'):
    d = json.load(open(f, encoding='utf-8'))
    slug_label[os.path.basename(f)[:-5]] = d.get('label')

def slugify(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower()
    out = []
    prev_dash = False
    for ch in s:
        if ch.isalnum():
            out.append(ch)
            prev_dash = False
        else:
            if out and not prev_dash:
                out.append('-')
                prev_dash = True
    slug = ''.join(out).strip('-')
    return slug

# La carpeta de media de categoria es el alias canonico (av via slugify(label)):
BASES = {}
for f in glob.glob('public/categorias/*'):
    if os.path.isdir(f):
        BASES[os.path.basename(f)] = f

def to_canonical(used_key):
    """Devuelve (slug, media_dir) o None."""
    if used_key in slug_label:
        c = slugify(used_key)
        # la media puede estar en u/slug (bazar) o u/label-slug
        if used_key in BASES:
            return used_key, used_key
        if c in BASES:
            return used_key, c
        return used_key, None
    # label-style: slugify -> matchear contra slugs y bases por slugify
    c = slugify(used_key)
    for slug in slug_label:
        if slugify(slug) == c:
            return slug, slug if slug in BASES else c
    # match por label slugified contra folders
    for k in BASES:
        if slugify(k) == c:
            slug = None
            for s in slug_label:
                if slugify(s) == slugify(k):
                    slug = s
            return slug, k
    return None, None

used = collections.Counter()
for f in glob.glob('content/productos/*.json'):
    d = json.load(open(f, encoding='utf-8'))
    used[d.get('category')] += 1

print('== mapeo category-usada -> (slug, media base) ==')
for k, v in used.most_common():
    if k is None:
        print(f'  (none): {v} productos')
        continue
    slug, base = to_canonical(k)
    print(f'  "{k}" -> slug="{slug}" media="{base}" ({v} prods)')

print()
print('== carpetas de media en public/categorias ==')
for b in sorted(BASES):
    print(' ', b)

print()
print('== slugs de content/categorias vs carpetas de media ==')
fs_slugs = set(slug_label)
media_bases = set(BASES)
print('  en content pero sin carpeta media:', sorted(fs_slugs - media_bases))
print('  carpeta media sin content:', sorted(media_bases - fs_slugs))
