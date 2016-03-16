from __future__ import print_function
from kafka import KafkaConsumer
import rethinkdb as r
import argparse
from rethinkdb.errors import RqlRuntimeError, RqlDriverError
import msgpack
import os

__author__ = 'Edgar Sandoval'


#Environment variables
DIRECTORY = 'SupportFiles/KafkaTransfers/'
RDB_HOST = os.environ.get('RDB_HOST') or 'localhost'
RDB_PORT = os.environ.get('RDB_PORT') or 28015
DISPATCH_DB = 'dispatch'
TABLE = 'test'

def dbSetup():
    #code here
    connection = r.connect(host=RDB_HOST, port=RDB_PORT)
    try:
        r.db_create(DISPATCH_DB).run(connection)
        r.db(DISPATCH_DB).table_create('dispatch').run(connection)
        print('Database completed. Run application')
    except RqlRuntimeError:
        print('Database already exists. Run Application')
    finally:
        connection.close()

def dbGetConnection():
    connection = r.connect(host=RDB_HOST, port=RDB_PORT)
    table = r.db(DISPATCH_DB).table(TABLE)
    return (connection, table)


if __name__ == "__main__":

    parser = argparse.ArgumentParser(description='Run test consumer')
    parser.add_argument('--setup', dest='run_setup', action='store_true')
    parser.add_argument('--database', dest='with_db', action='store_true')
    args = parser.parse_args()
    if args.run_setup:
        dbSetup()
    else:
        if not os.path.exists(DIRECTORY):
            os.makedirs(DIRECTORY)

        myConsumer = KafkaConsumer('test_topic', value_deserializer=msgpack.unpackb,
                                    bootstrap_servers=['localhost:9092'])

        for message in myConsumer:
<<<<<<< HEAD
            # print ("%s:%d:%d: key=%s value=%s" % (message.topic, message.partition,
            #                                   message.offset, message.key,
            #                                   message.value))
            data = message.value

            # This will now insert the data into the rethinkdb
            connection, table = dbGetConnection()
            result = table.insert(data).run(connection)

=======
>>>>>>> master

            data = message.value
            if len(data['carry_data_current']['photograph']) != 0:
                 photographData = data['carry_data_current']['photograph'][0]
                 outfile = "%s_%d_%d.jpg" % (message.topic, message.partition,message.offset)
                 with open(DIRECTORY+outfile, "wb") as fh:
                     fh.write(photographData)
            else:
                print(data)
            if args.with_db:
            #run with no database
                #TODO Add rethinkDB code here
                # This will now insert the data into the rethinkdb
                connection, table = dbGetConnection()
                result = table.insert(data).run(connection)


            #TODO check result for valid parameters
            


        myConsumer.close()

