# Test Consumer source 
# This code snippet is needed to consume the messages and push them
# through rethinkdb. The clusters transmit data through TCP server 
# connections and pushes data and retrieves to the webpage.


from __future__ import print_function
from kafka import KafkaConsumer
import rethinkdb as r
import argparse
from rethinkdb.errors import RqlRuntimeError, RqlDriverError
import msgpack
import os
import json

__author__ = 'Edgar Sandoval'


#Environment variables
DIRECTORY = 'SupportFiles/KafkaTransfers/'
RDB_HOST = os.environ.get('RDB_HOST') or 'localhost'
RDB_PORT = os.environ.get('RDB_PORT') or 28015
DISPATCH_DB = 'dispatch'
TABLE = 'wheres_carry'

def dbSetup():
    #code here
    connection = r.connect(host=RDB_HOST, port=RDB_PORT)
    try:
        r.db_create(DISPATCH_DB).run(connection)
        r.db(DISPATCH_DB).table_create(TABLE).run(connection)
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

            data = message.value
            if args.with_db:
            #run with database
                data['carry_data_current']['photograph'] = [r.binary(d) for d in data['carry_data_current']['photograph']]
                # This will now insert the data into the rethinkdb
                connection, table = dbGetConnection()
                result = table.insert(data).run(connection)

            #TODO check result for valid parameters

                print(result) # Write this to file!
                # All logs and error log output files
                # with open(DIRECTORY+outfile, "wb") as fh:
                #         fh.write(photographData)\

                # outfile = "log.txt"
                # file = open(DIRECTORY+"log.txt", "w")
                # file.write(result)
                # file.close()

                # open(DIRECTORY+"log.txt", "wb") as fh:
                #     fh.write()
                
                # outfile = "result.txt"

                # Appending data and if file doesn't exist "a+" will create one
                with open(DIRECTORY+"rethinkLog.txt", "a+") as fh:
                    fh.write(json.dumps(result))


                # Checking for update changes
                # cursor = r.table(TABLE).run(connection)
                # for document in cursor:
                #     print(document)

                #         fh.write(photographData)\

                connection.close()
                #TODO check result for valid parameters
                # Data logging all the data into a file called log.txt



            else:
                #run with no database
                if len(data['carry_data_current']['photograph']) != 0:
                    photographData = data['carry_data_current']['photograph'][0]
                    outfile = "%s_%d_%d.jpg" % (message.topic, message.partition,message.offset)
                    with open(DIRECTORY+outfile, "wb") as fh:
                        fh.write(photographData)
                else:
                    print(data)
        myConsumer.close()

