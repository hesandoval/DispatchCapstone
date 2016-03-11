from __future__ import print_function
from kafka import KafkaConsumer
import rethinkdb as r
import msgpack
import os

__author__ = 'Edgar Sandoval'


#Environment variables
RDB_HOST = os.environ.get('RDB_HOST') or 'localhost'
RDB_PORT = os.environ.get('RDB_PORT') or 28015
DISPATCH_DB = 'dispatch'
TABLE = 'test'

#TODO Add database configuration here
def dbSetup(connection):
    #code here
    connection = r.connect("localhost", 28015)
    dispatch = r.db('dispatch').table('test')

def dbGetConnection():
    connection = r.connect("localhost", 28015)
    table = r.db('dispatch').table('test')
    return (connection, table)

if __name__ == "__main__":
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
        # This will now insert the data into the rethinkdb
        connection, table = dbGetConnection()
        table.insert(data).run(connection)


        if len(data['carry_data_current']['photograph']) != 0:
             photographData = data['carry_data_current']['photograph'][0]
             outfile = "%s_%d_%d.jpg" % (message.topic, message.partition,message.offset)
             with open(DIRECTORY+outfile, "wb") as fh:
                 fh.write(photographData)


    myConsumer.close()

