from __future__ import print_function
from kafka import KafkaConsumer
import json
import rethinkdb as r

__author__ = 'Edgar Sandoval'

r.connect("localhost", 28015).repl()

myConsumer = KafkaConsumer('test_topic', 
							grou_id='dispatch',
							value_deserializer=lambda m: json.loads(m.decode('ascii')),
                            bootstrap_servers=['localhost:9092'])

for message in myConsumer:
    print ("%s:%d:%d: key=%s value=%s" % (message.topic, message.partition,
                                      message.offset, message.key,
                                      message.value))

# Consume earliest message avaliable but don't commit offsets
KafkaConsumer(auto_offset_reset='earliest', enable_autocommit=False)

# Consume msgpack
KafkaConsumer(value_deserializer=msgpack.unpackb)

#StopIteration if no message after 1 sec (Testing purposes but can be changed later on)
KafkaConsumer(consumer_timeout_ms=1000)

#Create a DB and table if you havent done already
# //r.db("dispatch").table_create("test").run()

# I beleive here the producer will send messages to the cluster and to the consumer to be sent through the db
r.table('dispatch').insert({
    "sender": 'Carry1',
    "battery": 89.21212121212122,
    "elevation": 0.11060606060606061,
    "latitude": 37.642992121212124,
    "longitude": -122.41739909090909,
    "left_open": "false",
    "right_open": "false",
    "light_back_on": "true",
    "light_front_on": "true",
    "speed": 2.0,
    "filename": '2016-02-22T01:22:00.132580-08:00',
    # //file: r.binary(contents) #This is for passing in the photo
  }).run()

#Retrieve a document by Primary Key
# //r.db('test').table('authors').get('7644aaf2-9928-4231-aa68-4e65e31bf219').run()
myConsumer.close()