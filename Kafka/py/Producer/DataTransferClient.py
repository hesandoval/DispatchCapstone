from __future__ import print_function
import time
from socket import *
import json
import sys


__author__ = 'Edgar Sandoval'


if __name__ == "__main__":
    data = []
    with open("messages.json") as f:

        for line in f:
            data.append(line)
        data = json.loads("".join(data))
    HOST,PORT = gethostname(), 9999


    for message in data:
        clientSocket = socket(AF_INET, SOCK_STREAM)
        clientSocket.connect((HOST, PORT))
        clientSocket.send(json.dumps(message))
        clientSocket.close()
        time.sleep(5)
