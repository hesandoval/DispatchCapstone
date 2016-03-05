from __future__ import print_function
import time
import socket as socket
import json
import random
import sys
from PIL import Image
import glob


__author__ = 'Edgar Sandoval'

def addPhoto(jsonObject, pictureFiles):
    picture = Image.open(random.choice(pictureFiles))
    width,height = picture.size
    aspectRatio = 1.0*height/width
    NEWWIDTH = 400
    newHeight = NEWWIDTH * aspectRatio
    newSize = NEWWIDTH,newHeight
    picture.thumbnail(newSize, Image.ANTIALIAS)
    jsonObject['carry_data_current']["photograph"].append(picture.tobytes().encode('base64'))
    return jsonObject




if __name__ == "__main__":
    data = []
    MESSAGESDIRECTORY = "SupportFiles/messages.json"
    PHOTOSDIRECTORY = "SupportFiles/photos/"
    pictureFiles = glob.glob(PHOTOSDIRECTORY + "/*")
    with open(MESSAGESDIRECTORY) as f:
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
        if (random.uniform(0,1) < .25):
            message = addPhoto(message, pictureFiles)
        clientSocket.send(json.dumps(message))
        clientSocket.close()
        time.sleep(random.randint(0, 5))
