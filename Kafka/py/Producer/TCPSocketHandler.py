from __future__ import print_function
import DispatchSingletonProducer
import SocketServer

__author__ = 'Edgar Sandoval'


class TCPSocketHandler(SocketServer.BaseRequestHandler):
    def handle(self):
        kafkaProducer = DispatchSingletonProducer.DispatchKafkaProducer()
        totalData = []
        print("{} wrote:".format(self.client_address[0]))
        while 1:
            try:
                data = self.request.recv(1024)
                if data:
                    totalData.append(data)
                else:
                    break
            except:
                pass

        totalData = r''.join(totalData)
        kafkaServerResponse = kafkaProducer.send(b"test_topic", totalData)

        #uncomment to debug
        # print(kafkaServerResponse.succeeded())
        # print(kafkaServerResponse.exception)

