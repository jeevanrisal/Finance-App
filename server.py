import time
import logging
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

# Server config
hostName = "localhost"
serverPort = 8080

# Allowed IPs for access control
allowed_ips = ['127.0.0.1']

# Logging setup
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class MyServer(BaseHTTPRequestHandler):  
    def do_GET(self):
        client_ip = self.client_address[0]
        logging.info(f"Received GET request from {client_ip} for path: {self.path}")

        if client_ip not in allowed_ips:
            self.send_response(403)
            self.send_header("Content-type", "text/html")
            self.end_headers()
            self.wfile.write(bytes("<html><body><h1>403 Forbidden</h1><p>Access denied.</p></body></html>", "utf-8"))
            logging.warning(f"Access denied for {client_ip}")
            return

        try:
            self.send_response(200)    
            self.send_header("Content-type", "text/html")
            self.end_headers()

            error_test = undefined_variable + 1  


            # Build HTML response
            html = f"""
            <html>
                <head>
                    <title>https://testserver.com</title>
                </head>
                <body>
                    <h1>Simple Web Server</h1>
                    <p>You requested: {self.path}</p>
                    <p>This is a sample response from the server.</p>
                </body>
            </html>
            """
            self.wfile.write(bytes(html, "utf-8"))
        except Exception as e:
            logging.error(f"Error while handling request: {e}")
            self.send_error(500, f"Internal Server Error: {e}")

if __name__ == "__main__":        
    webServer = ThreadingHTTPServer((hostName, serverPort), MyServer)
    print(f"Server started at http://{hostName}:{serverPort}")
    logging.info(f"Server started at http://{hostName}:{serverPort}")

    try:
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass
    webServer.server_close()
    logging.info("Server stopped.")
