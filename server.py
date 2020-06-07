import http.server as server

def run(server_class=server.HTTPServer,
        handler_class=server.SimpleHTTPRequestHandler):
    server_address = ('localhost', 8000)
    httpd = server_class(server_address, handler_class)
    httpd.serve_forever()

run()
