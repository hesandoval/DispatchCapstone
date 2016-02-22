from __future__ import print_function
import time
import socket as socket
import json
import random
import sys


__author__ = 'Edgar Sandoval'


if __name__ == "__main__":
    data = []
    with open("messages.json") as f:

        for line in f:
            data.append(line)
        data = json.loads("".join(data))
    HOST,PORT = socket.gethostname(), 9999
    for message in data:
        try:
            clientSocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            clientSocket.connect((HOST, PORT))
        except socket.error, (v, message):
            if clientSocket:
                clientSocket.close()
                sys.exit(1)
            print("Could not open socket {}".format(message))

        clientSocket.send(json.dumps(message))
        clientSocket.close()
        time.sleep(random.randint(0, 5))
