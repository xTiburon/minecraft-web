#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Añade una muestra de jugadores conectados a data/players.json.

Lo ejecuta .github/workflows/historial-jugadores.yml cada hora. También se puede
lanzar a mano:  python tools/muestra-jugadores.py

Guarda una muestra por bloque de 2 h (si ya hay una del bloque en curso, se
queda con el valor más alto) y conserva 30 días de historial, aunque la portada
solo dibuje las últimas 24 h: así queda registro de la actividad del servidor y
un fallo puntual de la tarea no deja huecos visibles.

También lleva el récord de jugadores conectados y la fecha en que se alcanzó.
"""

import json
import os
import ssl
import sys
import time
import urllib.request

API = 'https://api.mcsrvstat.us/3/planetmc.net'
RUTA = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'players.json')
BLOQUE_MS = 2 * 60 * 60 * 1000
CONSERVAR_MS = 30 * 24 * 60 * 60 * 1000


def consultar():
    req = urllib.request.Request(API, headers={'User-Agent': 'planetmc-web-historial/1.0'})
    with urllib.request.urlopen(req, timeout=25, context=ssl.create_default_context()) as r:
        d = json.load(r)
    if not d.get('online'):
        return None
    return int((d.get('players') or {}).get('online') or 0)


def main():
    try:
        n = consultar()
    except Exception as e:                       # noqa: BLE001
        print('No se pudo consultar el servidor: %s' % e)
        return 0                                 # no romper la tarea por un fallo de red
    if n is None:
        print('El servidor figura apagado: no se guarda muestra')
        return 0

    try:
        with open(RUTA, encoding='utf-8') as f:
            datos = json.load(f)
    except (OSError, ValueError):
        datos = {}

    muestras = [s for s in datos.get('samples', [])
                if isinstance(s, dict) and isinstance(s.get('t'), int) and isinstance(s.get('n'), int)]

    ahora = int(time.time() * 1000)
    bloque = ahora - (ahora % BLOQUE_MS)

    mismo = [s for s in muestras if s['t'] - (s['t'] % BLOQUE_MS) == bloque]
    muestras = [s for s in muestras if s not in mismo]
    muestras.append({'t': bloque, 'n': max([n] + [s['n'] for s in mismo])})

    corte = ahora - CONSERVAR_MS
    muestras = sorted([s for s in muestras if s['t'] >= corte], key=lambda s: s['t'])

    # Récord histórico: no se pierde aunque la muestra que lo marcó ya haya caducado.
    record = datos.get('record') if isinstance(datos.get('record'), dict) else {}
    mejor = max([s['n'] for s in muestras] + [n])
    if not isinstance(record.get('n'), int) or mejor > record['n']:
        record = {'n': mejor, 't': bloque}

    salida = {
        '_': ('Historial de jugadores conectados. Lo escribe '
              '.github/workflows/historial-jugadores.yml cada hora. '
              't = milisegundos UTC, n = jugadores (pico del bloque de 2 h). '
              'Se conservan 30 días.'),
        'updated': ahora,
        'record': record,
        'samples': muestras,
    }
    with open(RUTA, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(salida, f, ensure_ascii=False, indent=1)
        f.write('\n')
    print('Muestra guardada: %d jugadores · %d muestras · récord %d'
          % (n, len(muestras), record['n']))
    return 0


if __name__ == '__main__':
    sys.exit(main())
