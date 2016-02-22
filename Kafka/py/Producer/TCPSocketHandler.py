from __future__ import print_function
from socket import *
import SocketServer

__author__ = 'Edgar Sandoval'

class TCPSocketHandler(SocketServer.BaseRequestHandler):

    def handle(self):
        self.data = self.request.recv(1024).strip()
        print("{} wrote:".format(self.client_address[0]))
        print(self.data)

if __name__ == "__main__":
    HOST, PORT = gethostname(), 9999

    # Create the server, binding to localhost on port 9999
    server = SocketServer.TCPServer((HOST, PORT), TCPSocketHandler)

    server.serve_forever()

