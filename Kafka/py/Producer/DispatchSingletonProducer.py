from __future__ import print_function
from kafka import KafkaProducer
import json

__author__ = 'Edgar Sandoval'


class DispatchKafkaProducer:
    instance = None
    #TODO add functionality to pass parameters to the producer constructor
    def __init__(self):
        if not DispatchKafkaProducer.instance:
            DispatchKafkaProducer.instance = KafkaProducer(bootstrap_servers=['localhost:9092'],
                                                           client_id='Producer1',
                                                           value_serializer=None,
                                                           acks=1, key_serializer=None,
                                                          compression_type='gzip')
    def __getattr__(self, name):
        return getattr(self.instance, name)
