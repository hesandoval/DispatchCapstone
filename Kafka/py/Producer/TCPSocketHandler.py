from __future__ import print_function
import DispatchSimpleProducer
from socket import *
import SocketServer
import json

__author__ = 'Edgar Sandoval'


class TCPSocketHandler(SocketServer.BaseRequestHandler):
   # def setup(self):


    def handle(self):
        kafkaProducer = DispatchSimpleProducer.DispatchKafkaProducer()
        self.data = self.request.recv(1024).strip()
        print("{} wrote:".format(self.client_address[0]))
        dat = json.loads(self.data)
        print(self.data)
        kafkaProducer.send(b"test_topic", self.data)


if __name__ == "__main__":
    HOST, PORT = gethostname(), 9999

    # Create the server, binding to localhost on port 9999
    server = SocketServer.TCPServer((HOST, PORT), TCPSocketHandler)

    server.serve_forever()

