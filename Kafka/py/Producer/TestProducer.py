from __future__ import print_function
import DispatchSingletonProducer
import json
__author__ = 'Edgar Sandoval'


myProducer = DispatchSingletonProducer.DispatchKafkaProducer()
data = '{"carry_data_current": {"photograph": [], "sender": "Carry1", "created": "2016-02-22T01:21:46.395206-08:00", "light_status": {"back_on": true, "front_on": true}, "battery_life": 89.8989898989899, "door_status": {"right_open": false, "left_open": false}, "current_location": {"latitude": 37.642749656565655, "elevation": 0.14494949494949494, "longitude": -122.41750624242425}, "speed": 2.0}}'
print(myProducer.send(b'test_topic', data))

myProducer.close()