#!/usr/bin/env python3
"""Servidor local que imita el cleanUrls de Vercel.

    python tools/serve-local.py [raiz] [puerto]   # por defecto: la raiz del repo, 8099
"""
import os, sys, functools
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
PORT = int(sys.argv[2]) if len(sys.argv) > 2 else 8099


class H(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        p = super().translate_path(path)
        if os.path.isdir(p):
            if os.path.exists(os.path.join(p, 'index.html')):
                return p
            if os.path.exists(p + '.html'):
                return p + '.html'
        if not os.path.exists(p) and os.path.exists(p + '.html'):
            return p + '.html'
        return p

    def log_message(self, fmt, *a):
        sys.stderr.write("%s %s\n" % (self.command, self.path))


os.chdir(ROOT)
ThreadingHTTPServer(('127.0.0.1', PORT), functools.partial(H, directory=ROOT)).serve_forever()
