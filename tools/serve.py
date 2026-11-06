#!/usr/bin/env python3
"""Local preview that matches Vercel: /about serves about.html, /es/ serves es/index.html.
Run from anywhere:  python3 tools/serve.py   then open http://localhost:8765/
"""
import http.server
import os
import socketserver
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=str(ROOT), **k)

    def translate_path(self, path):
        p = super().translate_path(path)
        if not os.path.exists(p) and not p.endswith("/") and os.path.exists(p + ".html"):
            return p + ".html"
        return p


socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("", 8765), Handler) as httpd:
    print("http://localhost:8765/")
    httpd.serve_forever()
