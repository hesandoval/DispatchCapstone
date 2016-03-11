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
    # print ("%s:%d:%d: key=%s value=%s" % (message.topic, message.partition,
    #                                   message.offset, message.key,
    #                                   message.value))
    data = message.value


    #TODO Add rethinkDB code here
    '''
    data contains the dictionary object that contains data
    '''


    if len(data['carry_data_current']['photograph']) != 0:
         photographData = data['carry_data_current']['photograph'][0]
         outfile = "%s_%d_%d.jpg" % (message.topic, message.partition,message.offset)
         with open(DIRECTORY+outfile, "wb") as fh:
             fh.write(photographData)


myConsumer.close()
