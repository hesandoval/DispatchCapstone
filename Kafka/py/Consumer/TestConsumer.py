from __future__ import print_function
from kafka import KafkaConsumer
import msgpack
import os

__author__ = 'Edgar Sandoval'

DIRECTORY = 'SupportFiles/KafkaTransfers/'

if not os.path.exists(DIRECTORY):
    os.makedirs(DIRECTORY)

myConsumer = KafkaConsumer('test_topic', value_deserializer=msgpack.unpackb,
                            bootstrap_servers=['localhost:9092'])

for message in myConsumer:
    print ("%s:%d:%d: key=%s value=%s" % (message.topic, message.partition,
                                      message.offset, message.key,
                                      message.value))
    data = message.value
    if len(data['carry_data_current']['photograph']) != 0:
        photographData = data['carry_data_current']['photograph'][0]
        outfile = "%s_%d_%d.jpg" % (message.topic, message.partition,message.offset)
        # pic = cStringIO.StringIO()
        # # image_string = cStringIO.StringIO(base64.b64decode(photographData))
        # # image = Image.open(image_string)
        # # image.save(pic, image.format, quality=100)
        # # pic.seek(0)
        with open(DIRECTORY+outfile, "wb") as fh:
            fh.write(photographData)
        # fh.close()


myConsumer.close()
