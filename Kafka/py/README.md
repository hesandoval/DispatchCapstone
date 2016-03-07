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
```
In a new terminal window start Kafka Server
```bash 
$ bin/kafka-server-start.sh config/server.properties
```
## Python Environment Setup
Load environment from environment file
```bash 
$ conda env create -f environment.yml
```
Activate environment
```bash 
$ source activate peppermint
```
## Running Python Kafka Producer
Start TCP Socket Handler kafka produer
```bash 
$ python Producer/DispatchTCPServer.py
```
In a new terminal window start the TCP Data Transfer Client
```bash 
$ python Producer/DataTransferClient.py
```

## Consuming Messages
In a new terminal window start the packaged kafka consumer
```bash 
$ bin/kafka-console-consumer.sh --zookeeper localhost:2181 --topic test_topic --from-beginning
```
* Eventually this would be replaced by our custom built consumer client


