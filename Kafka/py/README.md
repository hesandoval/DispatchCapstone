# Kafka Setup
## Specifications
version: 0.9.0<br>
Python 2.7<br>
conda 3.18.8 or Anaconda distro<br>
## How to Run
Download
http://kafka.apache.org/documentation.html#quickstart_download
Untar
```bash 
$ tar -xzf kafka_2.11-0.9.0.0.tgz
```
Travel to root directory
```bash 
$ cd kafka_2.11-0.9.0.0
```
Start Zookeeper
```bash 
$ bin/zookeeper-server-start.sh config/zookeeper.properties
[2013-04-22 15:01:37,495] INFO Reading configuration from: config/zookeeper.properties (org.apache.zookeeper.server.quorum.QuorumPeerConfig)
...
```
In a new terminal window start Kafka Server/Broker
```bash 
$ bin/kafka-server-start.sh config/server.properties
[2013-04-22 15:01:47,028] INFO Verifying properties (kafka.utils.VerifiableProperties)
[2013-04-22 15:01:47,051] INFO Property socket.send.buffer.bytes is overridden to 1048576 (kafka.utils.VerifiableProperties)
...
```
* Zookeeper and the Kafka Server will output many lines of log information if no Java Exceptions are present <br> in the terminal output then the servers are ready to broker messages
## Python Environment Setup 
Load environment from environment file *ONE TIME*
```bash 
$ conda env create -f environment.yml
```
At times it may be necessary to update the Python environment if the environment file has changed 
```bash 
$ conda env update
Fetching package metadata: ....
```
Activate environment
```bash 
$ source activate CapstoneEnv1
discarding .../anaconda/bin from PATH
prepending .../anaconda/envs/CapstoneEnv1/bin to PATH
```
## Running Python Kafka Producer
Start TCP Socket Handler
```bash 
(CapstoneEnv1)$ python Producer/DispatchTCPServer.py
Listening on port 9999
```
* This server listens for connections from DataTransferClient.py and delivers messages to the Kafka Broker

In a new terminal window start the Data Transfer Client
```bash 
(CapstoneEnv1)$ python Producer/DataTransferClient.py
```
* This client transfers binary encoded python dictionaries to DispatchTCPServer.py
## Consuming Messages
In a new terminal window start the packaged kafka consumer
```bash 
$ bin/kafka-console-consumer.sh --zookeeper localhost:2181 --topic test_topic --from-beginning
{'carry_data_current': {'photograph': [], 'sender': 'Carry1', 'created': '2016-02-22T01:21:44.981065-08:00', 'light_status': {'back_on': True, 'front_on': True}, 'battery_life': 89.96969696969697, 'door_status': {'right_open': False, 'left_open': False}, 'current_location': {'latitude': 37.642724696969694, 'elevation': 0.14848484848484847, 'longitude': -122.41751727272728}, 'speed': 2.0}}
 ...
```
* This will dump all of the messages in the Kafka Queue into terminal output


