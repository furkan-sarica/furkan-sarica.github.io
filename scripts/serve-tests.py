#!/usr/bin/env python3
"""Yerel smoke sunucusu: eşzamanlı asset istekleri socket kuyruğunu taşırmaz."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

class TestSunucusu(ThreadingHTTPServer):
    request_queue_size = 128

class TestHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

if __name__ == '__main__':
    TestSunucusu(('127.0.0.1', 8080), TestHandler).serve_forever()
