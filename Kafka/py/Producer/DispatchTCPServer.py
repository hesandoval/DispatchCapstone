from __future__ import print_function
from socket import *
import SocketServer
import TCPSocketHandler

__author__ = 'Edgar Sandoval'

if __name__ == "__main__":
    HOST, PORT = gethostname(), 9999
    handler = TCPSocketHandler.TCPSocketHandler
    # Create the server, binding to localhost on port 9999
    server = SocketServer.TCPServer((HOST, PORT), handler)
    print("Listening on port {}:{}".format(HOST,PORT))

    try:
        server.serve_forever()
    except (KeyboardInterrupt, SystemExit):
        raise
    except:
        print("Goodbye")