from __future__ import print_function
from kafka import KafkaProducer
import json

__author__ = 'Edgar Sandoval'


class DispatchKafkaProducer:

    class __DispatchKafkaProducer(KafkaProducer):
        def __init__(self, bootstrapServers=['localhost:9092'], clientID="Producer1",
                     valueserializer=None,
                     acknowledge=1, keyserializer=None):
            KafkaProducer.__init__(KafkaProducer(bootstrap_servers=bootstrapServers,
                                                 client_id=clientID,
                                                 value_serializer=valueserializer,
                                                 acks=acknowledge,
                                                 key_serializer=keyserializer))

        def __str__(self):
            return repr(self)

    instance = None

    def __init__(self):
        if not DispatchKafkaProducer.instance:
            DispatchKafkaProducer.instance = DispatchKafkaProducer.__DispatchKafkaProducer()
    def __getattr__(self, name):
        return getattr(self.instance, name)
