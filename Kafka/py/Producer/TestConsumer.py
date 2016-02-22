from __future__ import print_function
from kafka import KafkaConsumer
import json

__author__ = 'Edgar Sandoval'

myConsumer = KafkaConsumer('test_topic', value_deserializer=lambda m: json.loads(m.decode('ascii')),
                            bootstrap_servers=['localhost:9092'])

for message in myConsumer:
    print ("%s:%d:%d: key=%s value=%s" % (message.topic, message.partition,
                                      message.offset, message.key,
                                      message.value))
myConsumer.close()