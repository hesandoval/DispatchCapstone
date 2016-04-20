from __future__ import print_function
import time
import socket as socket
import json
import random
import sys
import msgpack
import glob
import os


__author__ = 'Edgar Sandoval'

#Environment Variables
#make a directory
MESSAGESDIRECTORY = "SupportFiles/messages/*.json"
PHOTOSDIRECTORY = "SupportFiles/photos/"
SERVER_PORT = os.environ.get('SERVER_PORT') or 9999

def addPhoto(dispatchDict, pictureFiles):
    """
    Adds a random folder to the python dictionary
    @param dispatchDict: - json object representation of a single Carry message
    @param pictureFiles: - a list that references the items in the directory SupportFiles/photos/
    @return: jsonObject
    """
    picture = random.choice(pictureFiles)
    with open(picture, "rb") as infile:
        photoData = infile.read()
    dispatchDict['carry_data_current']["photograph"].append(photoData)
    return dispatchDict


if __name__ == "__main__":
    pictureFiles = glob.glob(PHOTOSDIRECTORY + "/*")
    for filename in glob.glob(MESSAGESDIRECTORY):
        data = []
        with open(filename) as f:
            for line in f:
                data.append(line)
            data = json.loads("".join(data))
        connectionCredentials = socket.gethostname(), SERVER_PORT
        for message in data:
            try:
                clientSocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                clientSocket.connect(connectionCredentials)
            except socket.error, (v, message):
                if clientSocket:
                    clientSocket.close()
                    sys.exit(1)
                print("Could not open socket {}".format(message))
            if("carry_data_current" in message.keys()):
                message = addPhoto(message, pictureFiles)

            clientSocket.send(msgpack.packb(message))
            clientSocket.close()
            time.sleep(.1)
