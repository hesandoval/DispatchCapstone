from __future__ import print_function
from socket import *
import SocketServer
import TCPSocketHandler

__author__ = 'Edgar Sandoval'


#Environment Variables
SERVER_PORT = os.environ.get('SERVER_PORT') or 9999

if __name__ == "__main__":
    connectionCredentials = gethostname(), SERVER_PORT
    handler = TCPSocketHandler.TCPSocketHandler
    # Create the server, binding to localhost on port 9999
    server = SocketServer.TCPServer(connectionCredentials, handler)
    print("Listening on port {}:{}".format(connectionCredentials))

    try:
        server.serve_forever()
    except (KeyboardInterrupt, SystemExit):
        raise
    except:
        print("Goodbye")