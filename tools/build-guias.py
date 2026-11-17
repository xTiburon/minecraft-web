#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Genera las páginas de /guias a partir de los fragmentos de tools/content/.

    python tools/build-guias.py

Escribe (sobrescribe) guias.html, guias/<slug>.html, assets/wiki-index.js y
sitemap.xml. El contenido editable vive SOLO en tools/content/<slug>.html:
nunca edites los .html generados, se pierden en la siguiente pasada.
"""

import os
import re
import datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.join(ROOT, 'tools', 'content')

SITE = 'https://www.planetmc.net'
DISCORD = 'https://discord.gg/HvcPfgXVHf'
TIENDA = 'https://tienda.planetmc.net/'
HOY = datetime.date.today().isoformat()

# slug, título, descripción (meta + buscador), grupo, palabras clave del buscador
PAGES = [
    ('primeros-pasos', 'Primeros pasos',
     'Guía desde cero: entrar al servidor, qué hacer en el spawn, buscar sitio, proteger tu casa y conseguir tus primeras monedas.',
     'Empezar', 'empezar nuevo novato inicio comenzar tutorial ip conectarse spawn'),
    ('comandos', 'Todos los comandos',
     'Lista completa de los comandos que puede usar un jugador, ordenados por tema, con su función y un ejemplo.',
     'Empezar', 'comandos lista ayuda help atajos'),
    ('protecciones', 'Protecciones',
     'Qué es una protección, cómo comprarla, colocarla, invitar amigos, cambiar permisos y qué pasa si dejas de jugar.',
     'Tu base', 'proteger proteccion terreno grief robo cofres miembros permisos /p inactividad'),
    ('casas-y-warps', 'Casas y warps',
     'Guarda tu casa con /sethome, vuelve con /home y viaja a las zonas públicas del servidor con /warp.',
     'Tu base', 'casa home sethome delhome warp warps spawn teleport viajar'),
    ('rtp', 'RTP y exploración',
     'Cómo funciona /rtp, qué buscar al explorar y cómo elegir un buen sitio para construir tu base.',
     'Tu base', 'rtp aleatorio explorar mundo viajar lejos terreno libre'),
    ('economia', 'Economía',
     'Cómo conseguir monedas, consultar tu saldo, pagar a otros jugadores, comprar y vender en la tienda.',
     'Dinero', 'dinero monedas economia balance pay baltop tienda shop vender comprar ganar'),
    ('trabajos', 'Trabajos',
     'Los diez trabajos del servidor: cómo unirte, cómo suben de nivel y cuánto pagan.',
     'Dinero', 'trabajos jobs minero granjero cazador leñador pescador nivel sueldo'),
    ('misiones', 'Misiones',
     'Misiones diarias y semanales: dónde verlas, cómo completarlas y cómo se reclaman las recompensas.',
     'Dinero', 'misiones diarias semanales objetivos recompensas quests'),
    ('subastas', 'Subastas',
     'Vende objetos a otros jugadores y compra lo que publiquen con la casa de subastas.',
     'Dinero', 'subasta ah auction vender comprar mercado publicar objetos'),
    ('pvp', 'PvP y zonas de combate',
     'Cómo se activa el PvP, las arenas Crystal y Pot del spawn, y lo que arriesgas al pelear.',
     'Comunidad', 'pvp combate arena crystal pot pelear matar morir perder items koth'),
    ('clanes', 'Clanes',
     'Funda un clan, invita miembros, usa el chat del clan y haz alianzas con otros clanes.',
     'Comunidad', 'clan clanes grupo equipo aliados chat invitar'),
    ('rangos', 'Rangos y kits',
     'Los rangos del servidor, qué ventajas dan dentro del juego y cómo se reclaman los kits.',
     'Más', 'rangos rango vip void nova lunar meteor eclipse planet kits beneficios tienda donar'),
    ('extras', 'Otras mecánicas',
     'Gemas, mochilas, cajas, votos, cosméticos, intercambios y el resto de sistemas del Survival.',
     'Más', 'gemas mochilas cajas crates llaves votar voto cosmeticos tags trade intercambio boda sentarse generadores'),
    ('normas', 'Normas',
     'Las reglas del servidor y las sanciones orientativas de cada infracción.',
     'Más', 'normas reglas sanciones ban mute castigo hacks grief publicidad'),
    ('faq', 'Preguntas frecuentes',
     'Las dudas más comunes: si es gratis, no premium, consolas, móviles, versiones y problemas al conectar.',
     'Más', 'faq dudas preguntas gratis premium no premium bedrock consola movil version conectar'),
]

GROUPS = ['Empezar', 'Tu base', 'Dinero', 'Comunidad', 'Más']

BY_SLUG = {p[0]: p for p in PAGES}

# Preguntas de /guias/faq marcadas para los resultados enriquecidos de Google.
FAQ = [
    ('¿Es gratis jugar en PlanetMC?',
     'Sí, es gratis. Solo necesitas Minecraft Java o Bedrock Edition y conectarte a planetmc.net.'),
    ('¿PlanetMC acepta cuentas no premium?',
     'Sí. La primera vez que entras registras una contraseña y la usas cada vez que vuelves a conectarte.'),
    ('¿Se puede jugar desde consola o móvil?',
     'Sí, con Bedrock Edition: Xbox, PlayStation, Nintendo Switch, Android, iOS y Windows. '
     'La dirección es planetmc.net y el puerto 19132.'),
    ('¿Java y Bedrock juegan juntos en PlanetMC?',
     'Sí, hay crossplay total: ambas ediciones comparten el mismo mundo, el mismo chat y la misma economía.'),
    ('¿Qué versión de Minecraft necesito?',
     'Lo mejor es la más reciente, aunque también se puede entrar con versiones anteriores a partir de la 1.16.'),
    ('¿Cómo protejo mi casa en PlanetMC?',
     'Con el comando /p: coge la protección gratuita de 11x11 y colócala en el centro de tu construcción. '
     'Dentro de la zona nadie más puede romper bloques ni abrir tus cofres.'),
    ('¿Cómo se gana dinero en el Survival?',
     'Vendiendo objetos en /shop, trabajando con /trabajos, completando /misiones, reclamando /recompensas '
     'cada día y votando por el servidor con /vote40.'),
    ('¿Me pueden atacar otros jugadores sin avisar?',
     'No. El PvP está desactivado por defecto y hace falta que los dos jugadores lo tengan activado, '
     'salvo dentro de las arenas del spawn.'),
]
FAQ_LD = ('<script type="application/ld+json">'
          '{"@context":"https://schema.org","@type":"FAQPage","mainEntity":['
          + ','.join('{"@type":"Question","name":"%s","acceptedAnswer":{"@type":"Answer","text":"%s"}}'
                     % (q.replace('"', "'"), a.replace('"', "'")) for q, a in FAQ)
          + ']}</script>' + chr(10))


def head(title, desc, canonical, extra=''):
    return f'''<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="format-detection" content="telephone=no">
<script>(function(w,d,s,l,i){{w[l]=w[l]||[];w[l].push({{'gtm.start':new Date().getTime(),event:'gtm.js'}});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);}})(window,document,'script','dataLayer','GTM-M62PP28N');</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-Q0E6MBKTMR"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}gtag('js',new Date());gtag('config','G-Q0E6MBKTMR');</script>
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<meta name="theme-color" content="#0A0B0D">
<link rel="canonical" href="{canonical}">
<link rel="alternate" hreflang="es" href="{canonical}">
<link rel="alternate" hreflang="es-419" href="{canonical}">
<link rel="alternate" hreflang="es-ES" href="{canonical}">
<link rel="alternate" hreflang="x-default" href="{canonical}">
<meta name="color-scheme" content="dark">
<link rel="icon" type="image/png" href="/favicon-96.png" sizes="96x96">
<link rel="icon" type="image/png" href="/assets/img/logo-192.png" sizes="192x192">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="shortcut icon" href="/favicon.ico">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{SITE}/assets/img/banner.jpg">
<meta property="og:url" content="{canonical}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="PlanetMC">
<meta property="og:locale" content="es_419">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{desc}">
<meta name="twitter:image" content="{SITE}/assets/img/banner.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&amp;family=JetBrains+Mono:wght@400;600&amp;display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/wiki.css">
<link rel="manifest" href="/site.webmanifest">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="PlanetMC">
{extra}</head>
<body>
'''


def header(active_guias=True):
    cur = ' aria-current="page"' if active_guias else ''
    return f'''<header class="wk-head">
  <div class="wk-head-in">
    <a class="wk-logo" href="/"><img src="/assets/logo.webp" alt="PlanetMC" width="26" height="26">PLANET<span>MC</span></a>
    <nav class="wk-nav">
      <a href="/">Inicio</a>
      <a href="/guias"{cur}>Guías</a>
      <a href="/guias/comandos">Comandos</a>
      <a href="/guias/faq">Dudas</a>
    </nav>
    <div class="wk-head-cta">
      <a class="wk-btn" href="{DISCORD}" target="_blank" rel="noopener noreferrer">Discord</a>
      <a class="wk-btn wk-btn-ac" href="{TIENDA}" target="_blank" rel="noopener noreferrer">Tienda</a>
    </div>
    <button class="wk-burger" id="wkBurger" aria-label="Abrir el índice de guías" aria-expanded="false" aria-controls="wkSide"><i></i><i></i><i></i></button>
  </div>
</header>
'''


def sidebar(slug):
    out = ['<aside class="wk-side" id="wkSide"><div class="wk-side-inner">']
    out.append('''<div class="wk-search" data-wk-search>
  <input type="search" placeholder="Buscar en las guías…" aria-label="Buscar en las guías" autocomplete="off">
  <div class="wk-results" data-wk-results hidden></div>
</div>''')
    out.append('<div class="wk-side-group"><p>Guías</p><a href="/guias">Portada de las guías</a></div>')
    for g in GROUPS:
        out.append(f'<div class="wk-side-group"><p>{g}</p>')
        for s, t, d, grp, k in PAGES:
            if grp != g:
                continue
            cur = ' aria-current="page"' if s == slug else ''
            out.append(f'<a href="/guias/{s}"{cur}>{t}</a>')
        out.append('</div>')
    out.append('<div class="wk-side-group" data-pwa-install data-pwa-class="wk-btn wk-btn-ac" '
               'data-pwa-full="1" hidden></div>')
    out.append('''<div class="wk-side-group wk-side-mobonly"><p>PlanetMC</p>
      <a href="/">Página principal</a>
      <a href="''' + DISCORD + '''" target="_blank" rel="noopener noreferrer">Discord</a>
      <a href="''' + TIENDA + '''" target="_blank" rel="noopener noreferrer">Tienda</a>
    </div>''')
    out.append('</div></aside>')
    return '\n'.join(out)


def footer():
    return f'''<footer class="wk-foot">
  <div class="wk-foot-in">
    <a class="wk-logo" href="/"><img src="/assets/logo.webp" alt="" width="22" height="22">PLANET<span>MC</span></a>
    <nav>
      <a href="/">Inicio</a>
      <a href="/guias">Guías</a>
      <a href="/guias/normas">Normas</a>
      <a href="{DISCORD}" target="_blank" rel="noopener noreferrer">Discord</a>
      <a href="{TIENDA}" target="_blank" rel="noopener noreferrer">Tienda</a>
    </nav>
    <div class="wk-copy">planetmc.net · © {datetime.date.today().year}</div>
  </div>
</footer>
<script src="/assets/wiki-index.js"></script>
<script src="/assets/wiki.js"></script>
<script defer src="/assets/pwa.js"></script>
</body>
</html>
'''


def sections_of(html):
    """Saca los <h2 id="..."> del fragmento para el buscador y el índice."""
    out = []
    for m in re.finditer(r'<h2 id="([^"]+)">(.*?)</h2>', html, re.S):
        txt = re.sub(r'<[^>]+>', '', m.group(2))
        txt = re.sub(r'\s+', ' ', txt).strip()
        out.append((m.group(1), txt))
    return out


def jsq(s):
    return s.replace('\\', '\\\\').replace("'", "\\'")


def build():
    index = []

    # ── Páginas de guía ───────────────────────────────────
    for i, (slug, title, desc, grp, kw) in enumerate(PAGES):
        frag_path = os.path.join(CONTENT, slug + '.html')
        if not os.path.exists(frag_path):
            raise SystemExit('Falta el contenido: tools/content/%s.html' % slug)
        with open(frag_path, encoding='utf-8') as f:
            frag = f.read().strip()

        secs = sections_of(frag)
        index.append({'t': title, 'd': desc, 'u': '/guias/' + slug, 'c': grp, 'k': kw,
                      's': [{'a': a, 't': t} for a, t in secs]})

        nxt = PAGES[i + 1] if i + 1 < len(PAGES) else None
        next_html = ''
        if nxt:
            next_html = (f'<a class="wk-next" href="/guias/{nxt[0]}">'
                         f'<span><em>Siguiente guía</em><b>{nxt[1]}</b></span><i>&rarr;</i></a>')
        else:
            next_html = ('<a class="wk-next" href="/guias">'
                         '<span><em>Volver</em><b>Portada de las guías</b></span><i>&rarr;</i></a>')

        ld = ('<script type="application/ld+json">'
              '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":['
              '{"@type":"ListItem","position":1,"name":"Inicio","item":"%s/"},'
              '{"@type":"ListItem","position":2,"name":"Guías","item":"%s/guias"},'
              '{"@type":"ListItem","position":3,"name":"%s","item":"%s/guias/%s"}]}'
              '</script>\n' % (SITE, SITE, title, SITE, slug))
        ld += ('<script type="application/ld+json">'
               '{"@context":"https://schema.org","@type":"TechArticle",'
               '"headline":"%s","description":"%s","url":"%s/guias/%s",'
               '"inLanguage":"es","datePublished":"%s","dateModified":"%s",'
               '"author":{"@type":"Organization","name":"PlanetMC","url":"%s/"},'
               '"publisher":{"@id":"%s/#organization"},'
               '"isPartOf":{"@type":"CollectionPage","name":"Guias de PlanetMC","url":"%s/guias"},'
               '"about":{"@type":"VideoGame","name":"Minecraft"},'
               '"audience":{"@type":"Audience","audienceType":"Jugadores de Minecraft"}}'
               '</script>\n' % (title, desc.replace('"', "'"), SITE, slug, HOY, HOY, SITE, SITE, SITE))
        if slug == 'faq':
            ld += FAQ_LD

        html = (head(f'{title} — Guías de PlanetMC', desc, f'{SITE}/guias/{slug}', ld)
                + header()
                + '<div class="wk-wrap">\n'
                + sidebar(slug)
                + '\n<main class="wk-main">\n'
                + f'<nav class="wk-crumb"><a href="/">Inicio</a><span>/</span><a href="/guias">Guías</a><span>/</span>{title}</nav>\n'
                + frag + '\n'
                + next_html + '\n'
                + '</main>\n</div>\n'
                + footer())

        with open(os.path.join(ROOT, 'guias', slug + '.html'), 'w', encoding='utf-8', newline='\n') as f:
            f.write(html)

    # ── Portada ───────────────────────────────────────────
    with open(os.path.join(CONTENT, '_portada.html'), encoding='utf-8') as f:
        portada = f.read().strip()
    p_title = 'Guías del Survival 26.2 | Wiki oficial de PlanetMC'
    p_desc = ('Wiki oficial de PlanetMC: guías del Survival paso a paso. Comandos, economía, '
              'protecciones, casas y warps, trabajos, misiones, subastas, PvP y rangos.')
    ld = ('<script type="application/ld+json">'
          '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":['
          '{"@type":"ListItem","position":1,"name":"Inicio","item":"%s/"},'
          '{"@type":"ListItem","position":2,"name":"Guías","item":"%s/guias"}]}'
          '</script>\n'
          '<script type="application/ld+json">'
          '{"@context":"https://schema.org","@type":"CollectionPage","name":"Guías de PlanetMC",'
          '"url":"%s/guias","inLanguage":"es","isPartOf":{"@id":"%s/#website"},"hasPart":[%s]}'
          '</script>\n' % (
              SITE, SITE, SITE, SITE,
              ','.join('{"@type":"Article","name":"%s","url":"%s/guias/%s"}' % (p[1], SITE, p[0]) for p in PAGES)))

    html = (head(p_title, p_desc, f'{SITE}/guias', ld)
            + header()
            + portada + '\n'
            + footer())
    with open(os.path.join(ROOT, 'guias.html'), 'w', encoding='utf-8', newline='\n') as f:
        f.write(html)

    # ── Índice del buscador ───────────────────────────────
    lines = ["/* Generado por tools/build-guias.py — no editar a mano. */", 'window.WK_INDEX=[']
    for e in index:
        secs = ','.join("{a:'%s',t:'%s'}" % (jsq(s['a']), jsq(s['t'])) for s in e['s'])
        lines.append("{t:'%s',d:'%s',u:'%s',c:'%s',k:'%s',s:[%s]},"
                     % (jsq(e['t']), jsq(e['d']), e['u'], jsq(e['c']), jsq(e['k']), secs))
    lines.append('];')
    with open(os.path.join(ROOT, 'assets', 'wiki-index.js'), 'w', encoding='utf-8', newline='\n') as f:
        f.write('\n'.join(lines) + '\n')

    # ── sitemap.xml ───────────────────────────────────────
    urls = [('/', '1.0', 'weekly'), ('/guias', '0.9', 'weekly')]
    urls += [('/guias/' + p[0], '0.8', 'monthly') for p in PAGES]
    sm = ['<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
          '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">', '']
    for loc, pri, freq in urls:
        sm.append('  <url>')
        sm.append(f'    <loc>{SITE}{loc}</loc>')
        sm.append(f'    <lastmod>{HOY}</lastmod>')
        sm.append(f'    <changefreq>{freq}</changefreq>')
        sm.append(f'    <priority>{pri}</priority>')
        if loc == '/':
            sm.append('    <image:image>')
            sm.append(f'      <image:loc>{SITE}/assets/img/logo.png</image:loc>')
            sm.append('      <image:title>PlanetMC — Logo oficial del servidor</image:title>')
            sm.append('    </image:image>')
            sm.append('    <image:image>')
            sm.append(f'      <image:loc>{SITE}/assets/img/banner.jpg</image:loc>')
            sm.append('      <image:title>PlanetMC — Banner del servidor Minecraft</image:title>')
            sm.append('    </image:image>')
        sm.append('  </url>')
    sm.append('</urlset>')
    with open(os.path.join(ROOT, 'sitemap.xml'), 'w', encoding='utf-8', newline='\n') as f:
        f.write('\n'.join(sm) + '\n')

    print('OK: %d guías + portada, índice con %d páginas, sitemap con %d URLs'
          % (len(PAGES), len(index), len(urls)))


if __name__ == '__main__':
    build()
