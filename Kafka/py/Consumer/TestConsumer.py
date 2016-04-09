from __future__ import print_function
from kafka import KafkaConsumer
import rethinkdb as r
import argparse
from rethinkdb.errors import RqlRuntimeError, RqlDriverError
import msgpack
import dateutil.parser
import os
import json

__author__ = 'Edgar Sandoval'


#Environment variables
DIRECTORY = 'SupportFiles/KafkaTransfers/'
RDB_HOST = os.environ.get('RDB_HOST') or 'localhost'
RDB_PORT = os.environ.get('RDB_PORT') or 28015
DISPATCH_DB = 'dispatch'
TABLE = 'wheres_carry'
PICTURESDIRECTORY = '../../WheresCarry/public/img/'

def dbSetup():
    """
    This is used to setup the database connection between the kafka consumer
    and rethinkdb. Setup should only run once but if setup is to be called
    again, an error message should appear prompting a already existing database
    @return: message either database being created or existing
    """

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
    """
    Connects kafka to the database. Establish a database connection
    @return: the connection and table listed within the specific database
    """
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
                if("carry_data_current" in data.keys()):

                    ##Delete ~ Push the photo data into the rethinkDB as a string and not as a binary

                    data['carry_data_current']['created'] = dateutil.parser.parse\
                        (data['carry_data_current']['created'])

                    # Getting the trip ID for the photo here
                    trip_id = data['carry_data_current']['trip_id']
                    timestamp = str(data['carry_data_current']['created'])

                    # Appending photodata into a file where trip_id will be the title of photo
                    photoData = data['carry_data_current']['photograph']
                    if not os.path.exists(PICTURESDIRECTORY + trip_id):
                        os.makedirs(PICTURESDIRECTORY + trip_id + "/")

                    photolist = []
                    for i, d in enumerate(data['carry_data_current']['photograph']):
                        outfile = trip_id + "/" + timestamp + "_" + str(i) + ".jpg"
                        with open(PICTURESDIRECTORY + outfile, "wb") as fh:
                            fh.write(d)
                        outfile = "/img/" + outfile
                        photolist.append(outfile)
                    data['carry_data_current']['photograph'] = photolist
                # This will now insert the data into the rethinkdb
                connection, table = dbGetConnection()
                result = table.insert(data).run(connection)


                # Appending data and if file doesn't exist "a+" will create one
                with open(DIRECTORY+"rethinkLog.txt", "a+") as fh:
                    fh.write(json.dumps(result))

                connection.close()


            else:
                #run with no database
                if len(data['carry_data_current']['photograph']) != 0:
                    photographData = data['carry_data_current']['photograph'][0]
                    outfile = "%s_%d_%d.jpg" % (message.topic, message.partition, message.offset)
                    with open(DIRECTORY+outfile, "wb") as fh:
                        fh.write(photographData)
                else:
                    print(data)
        myConsumer.close()

