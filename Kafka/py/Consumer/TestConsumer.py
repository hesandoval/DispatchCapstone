from __future__ import print_function
from kafka import KafkaConsumer
import rethinkdb as r
from rethinkdb.errors import RqlRuntimeError, RqlDriverError
import msgpack
import os

__author__ = 'Edgar Sandoval'


#TODO Add database configuration here
def dbSetup(connection):
    #code here
    connection = r.connect(host=RDB_HOST, port=RDB_PORT)
    dispatch = r.db(DISPATCH_DB).table(TABLE)

    try:
        r.db_create(TODO_DB).run(connection)
        r.db(TODO_DB).table_create('dispatch').run(connection)
        print 'Database completed. Run application'
    except RqlRuntimeError:
        print 'Database already exists. Run Application' 
    finally:
        connection.close()

def dbGetConnection():
    connection = r.connect(host=RDB_HOST, port=RDB_PORT, db=TODO_DB)
    table = r.db(DISPATCH_DB).table(TABLE)
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

