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
        totalData = []
        print("{} wrote:".format(self.client_address[0]))
        while 1:
            try:
                data = self.request.recv(1024).strip()
                if data:
                    totalData.append(data)
                else:
                    break
            except:
                pass
        #dat = json.loads(self.data)
        totalData = ''.join(totalData)
        #print(totalData)
        x = kafkaProducer.send(b"test_topic", totalData)
        print(x.succeeded())
        print(x.exception)


if __name__ == "__main__":
    HOST, PORT = gethostname(), 9999

    # Create the server, binding to localhost on port 9999
    server = SocketServer.TCPServer((HOST, PORT), TCPSocketHandler)
    print("Listening on port {}:{}".format(HOST,PORT))

    server.serve_forever()

